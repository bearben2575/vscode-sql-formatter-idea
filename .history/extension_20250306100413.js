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

        await editor.edit(editBuilder => {
            editBuilder.replace(selection, formattedLines.join('\n'));
        });

        // 执行文档格式化
        await vscode.commands.executeCommand('editor.action.formatDocument');
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 