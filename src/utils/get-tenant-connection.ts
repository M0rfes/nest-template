import tenantConfig from 'src/database/tenans';
import { getConnectionManager, DataSource } from 'typeorm';

export async function getTenantConnection(tentId: string) {
  const connectionName = `tenant_${tentId}`;
  const connectionmanager = getConnectionManager();
  if (connectionmanager.has(connectionName)) {
    const connection = connectionmanager.get(connectionName);
    return Promise.resolve(
      connection.isConnected ? connection : connection.connect(),
    );
  }

  const dataSource = new DataSource({
    ...tenantConfig(),
    name: connectionName,
    schema: connectionName,
  });
  return await dataSource.connect();
}
