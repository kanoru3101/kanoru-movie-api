import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImdbToTvEpisodeTable1689091118697 implements MigrationInterface {
    name = 'AddImdbToTvEpisodeTable1689091118697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tv_episode" ("id" SERIAL NOT NULL, "tmdb_id" integer NOT NULL, "imdb_id" character varying NOT NULL, "language" character varying NOT NULL, "name" character varying, "overview" character varying, "poster_path" character varying, "season_number" integer NOT NULL DEFAULT '0', "vote_average" real NOT NULL, "vote_count" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tvSeasonId" integer, CONSTRAINT "UQ_4b3c28e85a33e27933e30fb2245" UNIQUE ("language", "tmdb_id"), CONSTRAINT "PK_930dde0fcfc177e438e41ef7d70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tv_season" ("id" SERIAL NOT NULL, "tmdb_id" integer NOT NULL, "language" character varying NOT NULL, "name" character varying, "overview" character varying, "poster_path" character varying, "season_number" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tvId" integer, CONSTRAINT "UQ_448559acd6178225571e98a3f1f" UNIQUE ("language", "tmdb_id"), CONSTRAINT "PK_4ac9dd74095ad4721ffb45cba7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre_tvs_tv" ("genreId" integer NOT NULL, "tvId" integer NOT NULL, CONSTRAINT "PK_7a374696605cc462a2193ef544d" PRIMARY KEY ("genreId", "tvId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a9494fb79c6f7e24e20fcbeea" ON "genre_tvs_tv" ("genreId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac654b78f1e277ecf14e516aca" ON "genre_tvs_tv" ("tvId") `);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "test"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "tvId" integer`);
        await queryRunner.query(`ALTER TABLE "video" ADD "tvSeasonId" integer`);
        await queryRunner.query(`ALTER TABLE "video" ADD "tvEpisodeId" integer`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "language" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "tmdb_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "imdb_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "title" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "overview" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "original_title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "original_language" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "adult" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "backdrop_path" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "in_production" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "homepage" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "popularity" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "poster_path" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "first_air_date" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "last_air_date" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "number_of_episodes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "number_of_seasons" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "runtime" integer`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "tagline" character varying`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "vote_average" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "vote_count" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tv" ADD CONSTRAINT "UQ_c8d0ed5100d92407e694b8a12cb" UNIQUE ("language", "tmdb_id", "imdb_id")`);
        await queryRunner.query(`ALTER TABLE "tv_episode" ADD CONSTRAINT "FK_3cbcd8a4e809559dc5c7431de73" FOREIGN KEY ("tvSeasonId") REFERENCES "tv_season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tv_season" ADD CONSTRAINT "FK_9500225ef96d9eca7b50357263d" FOREIGN KEY ("tvId") REFERENCES "tv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_cf2d1fa3da5e4144a76ab6b6b4d" FOREIGN KEY ("tvId") REFERENCES "tv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_a60d3c8203b2053c3bd0c126aa6" FOREIGN KEY ("tvSeasonId") REFERENCES "tv_season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_5261b0d8c462c082911f7a8ea45" FOREIGN KEY ("tvEpisodeId") REFERENCES "tv_episode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genre_tvs_tv" ADD CONSTRAINT "FK_9a9494fb79c6f7e24e20fcbeea5" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "genre_tvs_tv" ADD CONSTRAINT "FK_ac654b78f1e277ecf14e516aca3" FOREIGN KEY ("tvId") REFERENCES "tv"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre_tvs_tv" DROP CONSTRAINT "FK_ac654b78f1e277ecf14e516aca3"`);
        await queryRunner.query(`ALTER TABLE "genre_tvs_tv" DROP CONSTRAINT "FK_9a9494fb79c6f7e24e20fcbeea5"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_5261b0d8c462c082911f7a8ea45"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_a60d3c8203b2053c3bd0c126aa6"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_cf2d1fa3da5e4144a76ab6b6b4d"`);
        await queryRunner.query(`ALTER TABLE "tv_season" DROP CONSTRAINT "FK_9500225ef96d9eca7b50357263d"`);
        await queryRunner.query(`ALTER TABLE "tv_episode" DROP CONSTRAINT "FK_3cbcd8a4e809559dc5c7431de73"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP CONSTRAINT "UQ_c8d0ed5100d92407e694b8a12cb"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "vote_count"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "vote_average"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "tagline"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "runtime"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "number_of_seasons"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "number_of_episodes"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "last_air_date"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "first_air_date"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "poster_path"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "popularity"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "homepage"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "in_production"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "backdrop_path"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "adult"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "original_language"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "original_title"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "overview"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "imdb_id"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "tv" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tvEpisodeId"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tvSeasonId"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tvId"`);
        await queryRunner.query(`ALTER TABLE "tv" ADD "test" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac654b78f1e277ecf14e516aca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a9494fb79c6f7e24e20fcbeea"`);
        await queryRunner.query(`DROP TABLE "genre_tvs_tv"`);
        await queryRunner.query(`DROP TABLE "tv_season"`);
        await queryRunner.query(`DROP TABLE "tv_episode"`);
    }

}
