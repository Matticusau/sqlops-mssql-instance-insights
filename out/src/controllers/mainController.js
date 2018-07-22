//
// Author:  Matt Lavery
// Date:    02/07/2018
// Purpose: Main Controller
//
// When         Who         What
// ------------------------------------------------------------------------------------------
// 02/07/2018   MLavery     Strictly set 'any' types to fix src\extension.ts(50,55): error TS7006: Parameter 'connection' implicitly has an 'any' type.
// 22/07/2018   MLavery     Updated openurl to opn (https://github.com/sindresorhus/opn)
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sqlops = require("sqlops");
const Utils = require("../utils");
const controllerBase_1 = require("./controllerBase");
const opn = require("opn");
/**
 * The main controller class that initializes the extension
 */
class MainController extends controllerBase_1.default {
    /**
     * Deactivates the extension
     */
    deactivate() {
        Utils.logDebug('Main controller deactivated');
    }
    /**
     * Activates the extension
     */
    activate() {
        //
        // register the tasks
        //
        sqlops.tasks.registerTask('mssql-instance-insights.openVersionHealthCheck', e => this.openurl('https://sqlversions.azurewebsites.net/healthcheck?version='));
        //
        // register the commands
        //
        vscode.commands.registerCommand('mssql-instance-insights.openVersionHealthCheckCmd', () => {
            this.openurl('https://sqlversions.azurewebsites.net/healthcheck?version=');
        });
        vscode.commands.registerCommand('mssql-instance-insights.runVersionHealthCheck', () => {
            // TBA
            // Display a message box to the user
            vscode.window.showInformationMessage('This feature is comming soon!');
        });
        return Promise.resolve(true);
    }
    openurl(link) {
        // openurl.open(link);
        opn(link);
    }
}
exports.default = MainController;

//# sourceMappingURL=mainController.js.map
