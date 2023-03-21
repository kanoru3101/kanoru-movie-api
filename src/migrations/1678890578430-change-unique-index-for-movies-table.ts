import { MigrationInterface, QueryRunner } from "typeorm";

export class changeUniqueIndexForMoviesTable1678890578430 implements MigrationInterface {
    name = 'changeUniqueIndexForMoviesTable1678890578430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_461f8b195191e92322ec5b4f8c7"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_7d73e5623327b53e04f3bf0253b"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_c62138a0a25e92b52e57cdc7d27" UNIQUE ("language", "movie_db_id", "imdb_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_c62138a0a25e92b52e57cdc7d27"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_7d73e5623327b53e04f3bf0253b" UNIQUE ("movie_db_id", "language")`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_461f8b195191e92322ec5b4f8c7" UNIQUE ("imdb_id", "language")`);
    }

}
