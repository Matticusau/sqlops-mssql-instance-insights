//
// Author:  Matt Lavery
// Date:    23/07/2018
// Purpose: InstanceUtils
//
// When         Who         What
// ------------------------------------------------------------------------------------------
// 23/07/2018   MLavery     Initial Code
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
const sqlops = require("sqlops");
class InstanceUtils {
    static getConnectionProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!InstanceUtils._connectionService) {
                // console.log('sqlops.connection.getCurrentConnection()');
                let currentConnection = yield sqlops.connection.getCurrentConnection();
                // console.log('currentConnection='+JSON.stringify(currentConnection));
                this._connectionService = sqlops.dataprotocol.getProvider(currentConnection.providerName, sqlops.DataProviderType.ConnectionProvider);
            }
            return InstanceUtils._connectionService;
        });
    }
    static getDatabases(ownerUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!InstanceUtils._connectionService) {
                let currentConnection = yield sqlops.connection.getCurrentConnection();
                this._connectionService = sqlops.dataprotocol.getProvider(currentConnection.providerName, sqlops.DataProviderType.ConnectionProvider);
            }
            return InstanceUtils._connectionService.listDatabases(ownerUri).then((result) => {
                if (result && result.databaseNames && result.databaseNames.length > 0) {
                    return result.databaseNames;
                }
            });
        });
    }
    static getQueryProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!InstanceUtils._queryProvider) {
                let currentConnection = yield sqlops.connection.getCurrentConnection();
                this._queryProvider = sqlops.dataprotocol.getProvider(currentConnection.providerName, sqlops.DataProviderType.QueryProvider);
            }
            return this._queryProvider;
        });
    }
}
exports.InstanceUtils = InstanceUtils;

//# sourceMappingURL=instanceUtils.js.map
