import { MigrationInterface, QueryRunner } from "typeorm";

export class initTables1677699396637 implements MigrationInterface {
    name = 'initTables1677699396637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "movie_id" character varying NOT NULL, "movie_db_id" character varying NOT NULL, "language" character varying NOT NULL, "name" character varying NOT NULL, "site" character varying NOT NULL, "key" character varying NOT NULL, "type" character varying NOT NULL, "size" integer NOT NULL, "official" boolean NOT NULL, "published_at" character varying NOT NULL, "movieId" integer, CONSTRAINT "UQ_3f1cb98952434c9bc86381b32ae" UNIQUE ("movie_db_id"), CONSTRAINT "UQ_7a0a240401b3318dba36dce6361" UNIQUE ("key"), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "movie_db_id" integer NOT NULL, "imdb_id" character varying NOT NULL, "title" character varying, "title_ua" character varying, "overview" character varying, "overview_ua" character varying, "original_title" character varying NOT NULL, "original_language" character varying NOT NULL, "adult" boolean NOT NULL, "backdrop_path" character varying, "backdrop_path_ua" character varying, "budget" integer, "homepage" character varying, "popularity" real NOT NULL, "poster_path" character varying, "poster_path_ua" character varying, "release_date" character varying NOT NULL, "revenue" bigint NOT NULL, "runtime" integer, "status" character varying NOT NULL, "tagline" character varying, "tagline_ua" character varying, "video" boolean NOT NULL, "vote_average" real NOT NULL, "vote_count" integer NOT NULL, CONSTRAINT "UQ_36b73cb80586d307a298975ff75" UNIQUE ("movie_db_id"), CONSTRAINT "UQ_f05604ea5d74a15426885d74e27" UNIQUE ("imdb_id"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre" ("id" SERIAL NOT NULL, "movie_db_id" integer NOT NULL, "name" character varying NOT NULL, "name_ua" character varying NOT NULL, CONSTRAINT "UQ_e610a4956993ca2bfe6e9f04ede" UNIQUE ("movie_db_id"), CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "UQ_c3cc5b5a599587a7828cae9fe4f" UNIQUE ("name_ua"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" jsonb NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "slug" character varying NOT NULL, "logo" character varying NOT NULL, "language" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_ac08b39ccb744ea6682c0db1c2d" UNIQUE ("slug"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre_movies_movie" ("genreId" integer NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_5b787840ea6352039c37c32e8f0" PRIMARY KEY ("genreId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dff457c114a6294863814818b0" ON "genre_movies_movie" ("genreId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e59764a417d4f8291747b744fa" ON "genre_movies_movie" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_5321e158adb1a2e78dce10e5053" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_dff457c114a6294863814818b0f" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_e59764a417d4f8291747b744faa" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_e59764a417d4f8291747b744faa"`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_dff457c114a6294863814818b0f"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_5321e158adb1a2e78dce10e5053"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e59764a417d4f8291747b744fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dff457c114a6294863814818b0"`);
        await queryRunner.query(`DROP TABLE "genre_movies_movie"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "genre"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "video"`);
    }

}
