import { connectionSource } from '../tenans';
import { getTenantConnection } from 'src/utils/get-tenant-connection';

const run = async () => {
  await connectionSource.connect();
  try {
    const schemas = await connectionSource.query(
      `select schema_name as name from information_schema.schemata;`,
    );

    for (const { name: schema } of schemas) {
      if (schema.startsWith('tenant_')) {
        const id = schema.replace('tenant_', '');
        const connection = await getTenantConnection(id);
        await connection.undoLastMigration();
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await connectionSource.close();
  }
};

run();
