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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const data = require("sqlops");
/**
 * Wrapper class to act as a facade over VSCode and Data APIs and allow us to test / mock callbacks into
 * this API from our code
 *
 * @export
 * @class ApiWrapper
 */
class ApiWrapper {
    // Data APIs
    registerWebviewProvider(widgetId, handler) {
        return data.dashboard.registerWebviewProvider(widgetId, handler);
    }
    registerControlHostProvider(widgetId, handler) {
        return data.dashboard.registerWebviewProvider(widgetId, handler);
    }
    /**
     * Get the configuration for a extensionName
     * @param extensionName The string name of the extension to get the configuration for
     * @param resource The optional URI, as a URI object or a string, to use to get resource-scoped configurations
     */
    getConfiguration(extensionName, resource) {
        if (typeof resource === 'string') {
            try {
                resource = this.parseUri(resource);
            }
            catch (e) {
                resource = undefined;
            }
        }
        return vscode.workspace.getConfiguration(extensionName, resource);
    }
    /**
     * Parse uri
     */
    parseUri(uri) {
        return vscode.Uri.parse(uri);
    }
    showOpenDialog(options) {
        return vscode.window.showOpenDialog(options);
    }
    showErrorMessage(message, ...items) {
        return vscode.window.showErrorMessage(message, ...items);
    }
}
exports.ApiWrapper = ApiWrapper;

//# sourceMappingURL=apiWrapper.js.map
