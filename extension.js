// 禁用特定的废弃警告
process.noDeprecation = true;

const vscode = require('vscode');
const { format } = require('sql-formatter');

function getConfiguration() {
    const config = vscode.workspace.getConfiguration('sql-beautify');
    return {
        indentSize: config.get('indentSize', 4),
        keywordCase: config.get('keywordCase', 'upper'),
        lineStyle: config.get('lineStyle', 'standard')
    };
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('sql-beautify.formatText', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            return;
        }

        const text = editor.document.getText(selection);
        
        try {
            // 获取用户配置
            const config = getConfiguration();
            
            // 检查文件类型
            const isXmlFile = editor.document.languageId === 'xml';
            const extraIndent = isXmlFile ? '        ' : ''; // XML文件添加8个空格（2个tab）的额外缩进
            
            // 保存所有 MyBatis 占位符
            const placeholders = [];
            let tempSql = text.replace(/[#$]{[^}]+}/g, (match) => {
                placeholders.push(match);
                return `__PLACEHOLDER_${placeholders.length - 1}__`;
            });

            // 根据配置格式化SQL
            const formattedSql = format(tempSql, {
                language: 'sql',
                indent: ' '.repeat(config.indentSize),
                uppercase: config.keywordCase === 'upper',
                linesBetweenQueries: 2
            });

            // 恢复占位符
            let finalSql = formattedSql;
            placeholders.forEach((placeholder, index) => {
                finalSql = finalSql.replace(`__PLACEHOLDER_${index}__`, placeholder);
            });

            // 将格式化后的SQL拆分成行
            const lines = finalSql.split('\n');

            // 根据配置处理行格式
            let formattedLines;
            if (config.lineStyle === 'compact') {
                // 紧凑模式：合并相关的行
                formattedLines = [];
                let currentLine = '';
                lines.forEach((line, index) => {
                    line = extraIndent + line.trim();
                    if (line.startsWith(extraIndent + 'FROM') || line.startsWith(extraIndent + 'WHERE') || 
                        line.startsWith(extraIndent + 'GROUP BY') || line.startsWith(extraIndent + 'HAVING') || 
                        line.startsWith(extraIndent + 'ORDER BY')) {
                        if (currentLine) {
                            formattedLines.push(currentLine + ' " + ');
                        }
                        currentLine = `"${line}`;
                    } else {
                        if (currentLine) {
                            currentLine += ' ' + line.substring(extraIndent.length);
                        } else {
                            currentLine = `${line}`;
                        }
                    }
                    if (index === lines.length - 1) {
                        formattedLines.push(currentLine);
                    }
                });
            } else {
                // 标准模式：每个子句单独一行
                formattedLines = lines.map((line, index) => {
                    line = extraIndent + line.trimEnd();
                    if (index === 0) {
                        return `${line} " + `;
                    } else if (index === lines.length - 1) {
                        return `"${line}`;
                    } else {
                        return `"${line} " + `;
                    }
                });
            }

            // 替换文本
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, formattedLines.join('\n'));
            });

            // 获取文档的语言ID
            const languageId = editor.document.languageId;
            
            // 获取该语言的默认格式化器
            const formatters = await vscode.commands.executeCommand(
                'vscode.executeFormatDocumentProvider',
                editor.document.uri,
                {
                    tabSize: editor.options.tabSize,
                    insertSpaces: editor.options.insertSpaces
                }
            );

            if (formatters && formatters.length > 0) {
                // 执行文档格式化
                await vscode.commands.executeCommand('editor.action.formatDocument');
            } else {
                // 如果没有可用的格式化器，尝试使用 VS Code 内置的格式化
                await vscode.commands.executeCommand('editor.action.formatDocument.none');
            }
        } catch (error) {
            console.error('Format error:', error);
            vscode.window.showErrorMessage(`格式化错误: ${error.message}`);
        }
    });

    // 新增的纯SQL格式化命令
    let pureSqlDisposable = vscode.commands.registerCommand('sql-beautify.formatPureSql', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            return;
        }

        const text = editor.document.getText(selection);
        
        try {
            // 获取用户配置
            const config = getConfiguration();
            
            // 检查文件类型
            const isXmlFile = editor.document.languageId === 'xml';
            const extraIndent = isXmlFile ? '        ' : ''; // XML文件添加8个空格（2个tab）的额外缩进
            
            // 保存所有 MyBatis 占位符
            const placeholders = [];
            let tempSql = text.replace(/[#$]{[^}]+}/g, (match) => {
                placeholders.push(match);
                return `__PLACEHOLDER_${placeholders.length - 1}__`;
            });

            // 根据配置格式化SQL
            const formattedSql = format(tempSql, {
                language: 'sql',
                indent: ' '.repeat(config.indentSize),
                uppercase: config.keywordCase === 'upper',
                linesBetweenQueries: 2
            });

            // 恢复占位符
            let finalSql = formattedSql;
            placeholders.forEach((placeholder, index) => {
                finalSql = finalSql.replace(`__PLACEHOLDER_${index}__`, placeholder);
            });

            // 为XML文件添加额外缩进
            if (isXmlFile) {
                finalSql = finalSql.split('\n').map(line => extraIndent + line).join('\n');
            }

            // 替换文本
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, finalSql);
            });

        } catch (error) {
            console.error('Format error:', error);
            vscode.window.showErrorMessage(`格式化错误: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable, pureSqlDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 