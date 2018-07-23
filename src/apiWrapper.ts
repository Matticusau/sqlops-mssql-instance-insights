//
// Author:  Matt Lavery
// Date:    23/07/2018
// Purpose: apiWrapper
//
// When         Who         What
// ------------------------------------------------------------------------------------------
// 23/07/2018   MLavery     Code taken from the Agent extension 
//


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import * as vscode from 'vscode';
import * as data from 'sqlops';

/**
 * Wrapper class to act as a facade over VSCode and Data APIs and allow us to test / mock callbacks into
 * this API from our code
 *
 * @export
 * @class ApiWrapper
 */
export class ApiWrapper {
    // Data APIs

    public registerWebviewProvider(widgetId: string, handler: (webview: data.DashboardWebview) => void): void {
        return data.dashboard.registerWebviewProvider(widgetId, handler);
    }


    public registerControlHostProvider(widgetId: string, handler: (webview: data.DashboardWebview) => void): void {
        return data.dashboard.registerWebviewProvider(widgetId, handler);
    }

    /**
     * Get the configuration for a extensionName
     * @param extensionName The string name of the extension to get the configuration for
     * @param resource The optional URI, as a URI object or a string, to use to get resource-scoped configurations
     */
    public getConfiguration(extensionName: string, resource?: vscode.Uri | string): vscode.WorkspaceConfiguration {
        if (typeof resource === 'string') {
            try {
                resource = this.parseUri(resource);
            } catch (e) {
                resource = undefined;
            }
        }
        return vscode.workspace.getConfiguration(extensionName, resource as vscode.Uri);
    }

    /**
     * Parse uri
     */
    public parseUri(uri: string): vscode.Uri {
        return vscode.Uri.parse(uri);
    }

    public showOpenDialog(options: vscode.OpenDialogOptions): Thenable<vscode.Uri[] | undefined> {
        return vscode.window.showOpenDialog(options);
    }

    public showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined> {
        return vscode.window.showErrorMessage(message, ...items);
    }

    // this was taken from the Agent extension, but throws the following error, come back to this if needed
    // src\apiWrapper.ts(72,9): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
    // public get workspaceRootPath(): string {
    //     return vscode.workspace.rootPath;
    // }
}
