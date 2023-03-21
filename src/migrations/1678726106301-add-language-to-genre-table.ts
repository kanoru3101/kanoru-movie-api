import { MigrationInterface, QueryRunner } from "typeorm";

export class addLanguageToGenreTable1678726106301 implements MigrationInterface {
    name = 'addLanguageToGenreTable1678726106301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_c3cc5b5a599587a7828cae9fe4f"`);
        await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "name_ua"`);
        await queryRunner.query(`ALTER TABLE "genre" ADD "language" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_e610a4956993ca2bfe6e9f04ede"`);
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c"`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_f802e07cbc2fee03de8d32fd8e6" UNIQUE ("language", "name")`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_d66ef86b30771223fcec7de9ff5" UNIQUE ("language", "movie_db_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_d66ef86b30771223fcec7de9ff5"`);
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_f802e07cbc2fee03de8d32fd8e6"`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_e610a4956993ca2bfe6e9f04ede" UNIQUE ("movie_db_id")`);
        await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "genre" ADD "name_ua" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_c3cc5b5a599587a7828cae9fe4f" UNIQUE ("name_ua")`);
    }

}
