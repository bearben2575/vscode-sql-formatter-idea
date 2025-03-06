// 禁用特定的废弃警告
process.noDeprecation = true;

const vscode = require('vscode');
const { format } = require('sql-formatter');

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
            // 保存所有 MyBatis 占位符
            const placeholders = [];
            let tempSql = text.replace(/#{[^}]+}/g, (match) => {
                placeholders.push(match);
                return `__PLACEHOLDER_${placeholders.length - 1}__`;
            });

            // 首先对SQL进行格式化
            const formattedSql = format(tempSql, {
                language: 'sql',
                indent: '    ',  // 使用4个空格作为缩进
                uppercase: true, // 关键字大写
                linesBetweenQueries: 2 // 查询之间的空行数
            });

            // 恢复占位符
            let finalSql = formattedSql;
            placeholders.forEach((placeholder, index) => {
                finalSql = finalSql.replace(`__PLACEHOLDER_${index}__`, placeholder);
            });

            // 将格式化后的SQL拆分成行
            const lines = finalSql.split('\n');

            // 对每行进行字符串拼接处理
            const formattedLines = lines.map((line, index) => {
                line = line.trimEnd();
                if (index === 0) {
                    return `${line} " + `;
                } else if (index === lines.length - 1) {
                    return `"${line}`;
                } else {
                    return `"${line} " + `;
                }
            });

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

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 