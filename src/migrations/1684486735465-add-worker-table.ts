import { MigrationInterface, QueryRunner } from "typeorm";

export class addWorkerTable1684486735465 implements MigrationInterface {
    name = 'addWorkerTable1684486735465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "worker" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'created', "data" jsonb NOT NULL DEFAULT '{}', "started_at" TIMESTAMP DEFAULT now(), "finished_at" TIMESTAMP DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dc8175fa0e34ce7a39e4ec73b94" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "worker"`);
    }

}
