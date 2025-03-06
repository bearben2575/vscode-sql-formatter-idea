const vscode = require('vscode');

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
        const lines = text.split('\n');

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

        // 先替换文本
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, formattedLines.join('\n'));
        });

        try {
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
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 