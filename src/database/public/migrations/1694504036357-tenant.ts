import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tenant1694504036357 implements MigrationInterface {
  name = 'Tenant1694504036357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tenant" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tenant"`);
  }
}
