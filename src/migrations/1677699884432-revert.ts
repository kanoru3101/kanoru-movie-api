import { MigrationInterface, QueryRunner } from "typeorm";

export class revert1677699884432 implements MigrationInterface {
    name = 'revert1677699884432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "revenue"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "revenue" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "revenue"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "revenue" integer NOT NULL`);
    }

}
