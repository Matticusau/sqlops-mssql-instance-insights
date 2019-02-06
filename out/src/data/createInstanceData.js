//
// Author:  Matt Lavery
// Date:    23/07/2018
// Purpose: create Instance Data model
//
// When         Who         What
// ------------------------------------------------------------------------------------------
// 23/07/2018   MLavery     Initial Code
//
//
// to do : Need to look to add this to mainController.ts for the additional info when needed
//
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
const instanceUtils_1 = require("../controllers/instanceUtils");
class CreateInstanceData {
    constructor(ownerUri) {
        this.ownerUri = ownerUri;
    }
    getServerVersion(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('starting getServerVersion()');
            let queryService = yield instanceUtils_1.InstanceUtils.getQueryProvider();
            console.log('queryService.providerId=' + queryService.providerId);
            queryService.runQueryAndReturn(this.ownerUri, 'SELECT name FROM sys.databases').then((result) => {
                //queryService.runQueryString(this.ownerUri, 'SELECT name FROM sys.databases').then( (result: sqlops.SimpleExecuteResult) => {
                console.log("instanceData.get.result=" + JSON.stringify(result));
                console.log('completed getServerVersion() TSQL');
                callback('12.0.1234.0');
            }, (error) => {
                console.error('Error while running getServerVersion() TSQL');
                callback('12.0.1234.0');
            });
        });
    }
}
exports.CreateInstanceData = CreateInstanceData;

//# sourceMappingURL=createInstanceData.js.map
