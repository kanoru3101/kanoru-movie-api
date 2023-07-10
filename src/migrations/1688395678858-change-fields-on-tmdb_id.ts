import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldsOnTmdbId1688395678858 implements MigrationInterface {
    name = 'ChangeFieldsOnTmdbId1688395678858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_d66ef86b30771223fcec7de9ff5"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_c62138a0a25e92b52e57cdc7d27"`);
        await queryRunner.query(`ALTER TABLE "genre" RENAME COLUMN "movie_db_id" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "video" RENAME COLUMN "movie_db_id" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "movie_db_id" TO "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_5eac6bc419a1950894f6200d5e4" UNIQUE ("language", "tmdb_id")`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_81318d9d91434f9be4c244aeaa0" UNIQUE ("language", "tmdb_id", "imdb_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_81318d9d91434f9be4c244aeaa0"`);
        await queryRunner.query(`ALTER TABLE "genre" DROP CONSTRAINT "UQ_5eac6bc419a1950894f6200d5e4"`);
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "tmdb_id" TO "movie_db_id"`);
        await queryRunner.query(`ALTER TABLE "video" RENAME COLUMN "tmdb_id" TO "movie_db_id"`);
        await queryRunner.query(`ALTER TABLE "genre" RENAME COLUMN "tmdb_id" TO "movie_db_id"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_c62138a0a25e92b52e57cdc7d27" UNIQUE ("movie_db_id", "imdb_id", "language")`);
        await queryRunner.query(`ALTER TABLE "genre" ADD CONSTRAINT "UQ_d66ef86b30771223fcec7de9ff5" UNIQUE ("movie_db_id", "language")`);
    }

}
