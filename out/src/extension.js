//
// Author:  Matt Lavery
// Date:    02/07/2018
// Purpose: extension entry module
//
// When         Who         What
// ------------------------------------------------------------------------------------------
// 02/07/2018   MLavery     Strictly set 'any' types to fix src\extension.ts(50,55): error TS7006: Parameter 'connection' implicitly has an 'any' type.
//
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mainController_1 = require("./controllers/mainController");
let controllers = [];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Starting activation');
    // taken from the extensionSamples
    let activations = [];
    // Start the main controller
    let mainController = new mainController_1.default(context);
    controllers.push(mainController);
    context.subscriptions.push(mainController);
    activations.push(mainController.activate());
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mssql-instance-insights" is now active!');
    // activations - from extensionSamples
    return Promise.all(activations)
        .then((results) => {
        for (let result of results) {
            if (!result) {
                return false;
            }
        }
        return true;
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    // deactive any controllers we loaded
    for (let controller of controllers) {
        controller.deactivate();
    }
}
exports.deactivate = deactivate;

//# sourceMappingURL=extension.js.map
