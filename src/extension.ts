// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import configuration from "./config/configuration";
import TranslationServiceFactory from "./translator";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "translator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('translator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (editor) {
			// 获取所选文本
			const selectedText = editor.document.getText(editor.selection);
			console.log('Selected text:', selectedText);
			vscode.window.showInformationMessage(selectedText);
		}

		// vscode.window.showInformationMessage('Hello World from Translator!');
	});

	console.log(
		JSON.stringify(configuration)
	);

	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((event: vscode.TextEditorSelectionChangeEvent) => {
		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (editor) {
			// 获取所选文本
			const selectedText = editor.document.getText(editor.selection);
			console.log('Selected text:', selectedText);
		}
	}));

	// 记得在适当的时候取消事件监听器
	// disposable.dispose();


	// Listening to configuration changes
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {

		if (e.affectsConfiguration('.insertEmptyLastLine')) {
			if (vscode.window.activeTextEditor) {

				const currentDocument = vscode.window.activeTextEditor.document;

				// 1) Get the configured glob pattern value for the current file
				const value: any = vscode.workspace.getConfiguration('', currentDocument.uri).get('conf.resource.insertEmptyLastLine');

				// 2) Check if the current resource matches the glob pattern
				const matches = value[currentDocument.fileName];

				// 3) If matches, insert empty last line
				if (matches) {
					vscode.window.showInformationMessage('An empty line will be added to the document ' + currentDocument.fileName);
				}
			}
		}

		// Check if a language configuration is changed for a text document
		if (e.affectsConfiguration('conf.language.showSize', vscode.window.activeTextEditor?.document)) {
			// noop 
		}

		// Check if a language configuration is changed for a language
		if (e.affectsConfiguration('conf.language.showSize', { languageId: 'typescript' })) {
			// noop 
		}

	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }
