import { MigrationInterface, QueryRunner } from "typeorm";

export class addLanguageToMovieTable1678465796748 implements MigrationInterface {
    name = 'addLanguageToMovieTable1678465796748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "title_ua"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "overview_ua"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "backdrop_path_ua"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "poster_path_ua"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "tagline_ua"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "language" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_36b73cb80586d307a298975ff75"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_f05604ea5d74a15426885d74e27"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_461f8b195191e92322ec5b4f8c7" UNIQUE ("language", "imdb_id")`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_7d73e5623327b53e04f3bf0253b" UNIQUE ("language", "movie_db_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_7d73e5623327b53e04f3bf0253b"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_461f8b195191e92322ec5b4f8c7"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_f05604ea5d74a15426885d74e27" UNIQUE ("imdb_id")`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_36b73cb80586d307a298975ff75" UNIQUE ("movie_db_id")`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "tagline_ua" character varying`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "poster_path_ua" character varying`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "backdrop_path_ua" character varying`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "overview_ua" character varying`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "title_ua" character varying`);
    }

}
