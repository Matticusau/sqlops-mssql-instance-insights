//
// Author:  Matt Lavery
// Date:    02/07/2018
// Purpose: Utils
//
// When         Who         What
// ------------------------------------------------------------------------------------------
// 02/07/2018   MLavery     Strictly set 'any' types to fix src\extension.ts(50,55): error TS7006: Parameter 'connection' implicitly has an 'any' type.
//
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const handlebars = require("handlebars");
const path = require("path");
const vscode = require("vscode");
const Constants = require("./constants");
const LocalizedConstants = require("./localizedConstants");
/**
 * Helper to log messages to the developer console if enabled
 * @param msg Message to log to the console
 */
function logDebug(msg) {
    let config = vscode.workspace.getConfiguration(Constants.extensionConfigSectionName);
    let logDebugInfo = config[Constants.configLogDebugInfo];
    if (logDebugInfo === true) {
        let currentTime = new Date().toLocaleTimeString();
        let outputMsg = '[' + currentTime + ']: ' + msg ? msg.toString() : '';
        console.log(outputMsg);
    }
}
exports.logDebug = logDebug;
function renderTemplateHtml(extensionPath, templateName, templateValues) {
    // let templatePath = path.join(extensionPath, 'resources', templateName);
    let templatePath = path.join(extensionPath, 'resources', templateName);
    // 1) Read the template from the disk
    // 2) Compile it as a handlebars template and render the HTML
    // 3) On failure, return a simple string as an error
    return fs.readFile(templatePath, 'utf-8')
        .then((templateText) => {
        let template = handlebars.compile(templateText);
        return template(templateValues);
    })
        .then(undefined, (error) => {
        logDebug(error);
        return LocalizedConstants.msgErrorLoadingTab;
    });
}
exports.renderTemplateHtml = renderTemplateHtml;

//# sourceMappingURL=utils.js.map
