import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class User1694504010893 implements MigrationInterface {
  name = 'User1694504010893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."user" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_${schema}_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(`DROP TABLE "${schema}"."user"`);
  }
}
