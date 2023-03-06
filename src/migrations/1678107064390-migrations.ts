import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1678107064390 implements MigrationInterface {
    name = 'migrations1678107064390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "revenue"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "revenue" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "revenue"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "revenue" integer NOT NULL`);
    }

}
