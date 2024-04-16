import * as vscode from 'vscode';

class Configuration {

    engine: string;

    targetLanguage: string;

    volc: {
        accessKey: string;
        secretKey: string;
    };

    constructor() {
        const workspaceConfiguration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('translator');

        this.engine = workspaceConfiguration.get('engine') ?? '';
        this.targetLanguage = workspaceConfiguration.get('targetLanguage') ?? '';
        this.volc = {
            accessKey: workspaceConfiguration.get('volc.accessKey') ?? '',
            secretKey: workspaceConfiguration.get('volc.secretKey') ?? ''
        };
    }
}

export default new Configuration();