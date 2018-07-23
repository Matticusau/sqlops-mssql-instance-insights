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

import * as sqlops from 'sqlops';

export class InstanceUtils {

	private static _connectionService: sqlops.ConnectionProvider;
	private static _queryProvider: sqlops.QueryProvider;

    public static async getConnectionProvider(): Promise<sqlops.ConnectionProvider> {
		if (!InstanceUtils._connectionService) {
            // console.log('sqlops.connection.getCurrentConnection()');
            let currentConnection = await sqlops.connection.getCurrentConnection();
            // console.log('currentConnection='+JSON.stringify(currentConnection));
			this._connectionService = sqlops.dataprotocol.getProvider<sqlops.ConnectionProvider>(currentConnection.providerName, sqlops.DataProviderType.ConnectionProvider);
		}
		return InstanceUtils._connectionService;
    }
        
	public static async getDatabases(ownerUri: string): Promise<string[]> {
		if (!InstanceUtils._connectionService) {
			let currentConnection = await sqlops.connection.getCurrentConnection();
			this._connectionService = sqlops.dataprotocol.getProvider<sqlops.ConnectionProvider>(currentConnection.providerName, sqlops.DataProviderType.ConnectionProvider);
		}
		return InstanceUtils._connectionService.listDatabases(ownerUri).then((result: any) => {
			if (result && result.databaseNames && result.databaseNames.length > 0) {
				return result.databaseNames;
			}
		});
	}

	public static async getQueryProvider(): Promise<sqlops.QueryProvider> {
		if (!InstanceUtils._queryProvider) {
			let currentConnection = await sqlops.connection.getCurrentConnection();
			this._queryProvider = sqlops.dataprotocol.getProvider<sqlops.QueryProvider>(currentConnection.providerName, sqlops.DataProviderType.QueryProvider);
		}
		return this._queryProvider;
    }

}