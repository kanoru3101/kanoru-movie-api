import { MigrationInterface, QueryRunner } from "typeorm";

export class fixDataForWorkerTable1684691420436 implements MigrationInterface {
    name = 'fixDataForWorkerTable1684691420436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker" DROP COLUMN "started_at"`);
        await queryRunner.query(`ALTER TABLE "worker" ADD "started_at" character varying DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "worker" DROP COLUMN "finished_at"`);
        await queryRunner.query(`ALTER TABLE "worker" ADD "finished_at" character varying DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker" DROP COLUMN "finished_at"`);
        await queryRunner.query(`ALTER TABLE "worker" ADD "finished_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "worker" DROP COLUMN "started_at"`);
        await queryRunner.query(`ALTER TABLE "worker" ADD "started_at" TIMESTAMP DEFAULT now()`);
    }

}
