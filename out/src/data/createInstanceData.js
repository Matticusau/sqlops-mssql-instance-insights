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
    getServerVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let queryService = yield instanceUtils_1.InstanceUtils.getQueryProvider();
            queryService.runQueryAndReturn(this.ownerUri, 'SELECT @@VERSION').then((result) => {
                console.log("instanceData.get.result=" + JSON.stringify(result));
                return '12.0.1234.0';
            });
        });
    }
}
exports.CreateInstanceData = CreateInstanceData;

//# sourceMappingURL=createInstanceData.js.map
