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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const sqlops = require("sqlops");
const Utils = require("../utils");
const controllerBase_1 = require("./controllerBase");
const createInstanceData_1 = require("../data/createInstanceData");
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
        sqlops.tasks.registerTask('mssql-instance-insights.openVersionHealthCheck', (e) => this.openVersionHealthCheck(e.ownerUri));
        //
        // register the commands
        //
        vscode.commands.registerCommand('mssql-instance-insights.openVersionHealthCheckCmd', (ownerUri) => {
            this.openVersionHealthCheck(ownerUri);
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
    openVersionHealthCheck(ownerUri) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('this.openVersionHealthCheck => starting');
            let instanceData = new createInstanceData_1.CreateInstanceData(ownerUri);
            let serverVersion = yield instanceData.getServerVersion();
            console.log('serverVersion=' + JSON.stringify(serverVersion));
            // let qryPdr = await InstanceUtils.getQueryProvider();
            // // console.log('connSvc=' + JSON.stringify(connSvc));
            // qryPdr.runQueryAndReturn()
            // get the version number
            // this.openurl('https://sqlversions.azurewebsites.net/healthcheck?version=');
            this.openurl('https://sqlversions.azurewebsites.net/healthcheck');
            console.log('this.openVersionHealthCheck => done');
        });
    }
}
exports.default = MainController;

//# sourceMappingURL=mainController.js.map
