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

	let isAdd = true;

	context.subscriptions.push(
		vscode.commands.registerCommand('translator.translateAndHover', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user

			const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}


			const selectedText = editor.document.getText(editor.selection);
			if (selectedText.length > 0) {
				vscode.window.showInformationMessage(selectedText);
				return;
			}
			// 获取所在文本
			const positionText = editor.document.getText(
				editor.document.getWordRangeAtPosition(editor.selection.active)
			);
			// vscode.window.showInformationMessage(positionText);
			// return printDefinitionsForActiveEditor();

			// vscode.commands.executeCommand("vscode.executeHoverProvider"
			// )

			await vscode.commands.executeCommand<vscode.Hover>(
				'vscode.executeHoverProvider',
				editor.document.uri,
				editor.selection.active
			).then((hovers: vscode.Hover) => {
				console.log(hovers);
				// if (hovers && hovers.length > 0) {
				// 	// 处理获取到的悬停信息
				// 	const hoverText = hovers.map(hover => hover.contents.value).join('\n\n');

				// 	// 显示悬停信息，或者根据需要进行其他操作
				// 	console.log(hoverText);
				// } else {
				// 	// 如果没有悬停信息，可以执行其他逻辑
				// 	console.log('No hover information available at this position.');
				// }
			});
			// vscode.commands.executeCommand("editor.action.showHover");

			if (isAdd) {
				vscode.languages.registerHoverProvider(
					'typescript',
					new (class implements vscode.HoverProvider {
						provideHover(
							_document: vscode.TextDocument,
							_position: vscode.Position,
							_token: vscode.CancellationToken
						): vscode.ProviderResult<vscode.Hover> {
							const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
							const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);

							// To enable command URIs in Markdown content, you must set the `isTrusted` flag.
							// When creating trusted Markdown string, make sure to properly sanitize all the
							// input content so that only expected command URIs can be executed
							contents.isTrusted = true;

							return new vscode.Hover(contents);
						}
					})()
				);
				isAdd = false;
			}
			vscode.commands.executeCommand("editor.action.showDefinitionPreviewHover");
			// vscode.window.showInformationMessage('Hello World from Translator!');
		})
	);

	console.log(
		JSON.stringify(configuration)
	);

	context.subscriptions.push(disposable);

	// context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((event: vscode.TextEditorSelectionChangeEvent) => {
	// 	const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
	// 	if (editor) {
	// 		// 获取所选文本
	// 		const selectedText = editor.document.getText(editor.selection);
	// 		console.log('Selected text:', selectedText);
	// 	}
	// }));

	// vscode.languages.registerHoverProvider("typescript", {
	// 	// provideHover(document, position) {
	// 	// 	const word = document.getText(
	// 	// 		document.getWordRangeAtPosition(position, /\b\w+(?=\(.*\))/)
	// 	// 	);
	// 	// 	if (builtin_funcs[word] != undefined) {
	// 	// 		return new vscode.Hover(
	// 	// 			new vscode.MarkdownString(`${builtin_funcs[word]}`)
	// 	// 		);
	// 	// 	} else {
	// 	// 		return null;
	// 	// 	}
	// 	// },
	// 	provideHover(document, position, token) {
	// 		console.log('post', position);
	// 		console.log('Hovering over: ', document.getText(document.getWordRangeAtPosition(position)));
	// 		return {
	// 			contents: ['Hover Content', 'More Content']
	// 		};
	// 	}
	// });

	async function printDefinitionsForActiveEditor() {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}

		const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
			'editor.action.showHover',
			activeEditor.document.uri,
			activeEditor.selection.active
		);
		for (const definition of definitions) {
			console.log(definition);
		}

		return new vscode.Hover("123");
	}

	// hover 增加可执行命令
	// vscode.languages.registerHoverProvider(
	// 	'typescript',
	// 	new (class implements vscode.HoverProvider {
	// 		provideHover(
	// 			_document: vscode.TextDocument,
	// 			_position: vscode.Position,
	// 			_token: vscode.CancellationToken
	// 		): vscode.ProviderResult<vscode.Hover> {
	// 			const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
	// 			const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);

	// 			// To enable command URIs in Markdown content, you must set the `isTrusted` flag.
	// 			// When creating trusted Markdown string, make sure to properly sanitize all the
	// 			// input content so that only expected command URIs can be executed
	// 			contents.isTrusted = true;

	// 			return new vscode.Hover(contents);
	// 		}
	// 	})()
	// );

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