import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTvTables1692793848759 implements MigrationInterface {
    name = 'AddTvTables1692793848759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tv_episode" ("id" SERIAL NOT NULL, "tmdb_id" integer NOT NULL, "imdb_id" character varying NOT NULL, "language" character varying NOT NULL, "name" character varying, "overview" character varying, "poster_path" character varying, "season_number" integer NOT NULL DEFAULT '0', "vote_average" real NOT NULL, "vote_count" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tvSeasonId" integer, CONSTRAINT "UQ_4b3c28e85a33e27933e30fb2245" UNIQUE ("language", "tmdb_id"), CONSTRAINT "PK_930dde0fcfc177e438e41ef7d70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tv_season" ("id" SERIAL NOT NULL, "tmdb_id" integer NOT NULL, "language" character varying NOT NULL, "name" character varying, "overview" character varying, "poster_path" character varying, "season_number" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tvId" integer, CONSTRAINT "UQ_448559acd6178225571e98a3f1f" UNIQUE ("language", "tmdb_id"), CONSTRAINT "PK_4ac9dd74095ad4721ffb45cba7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tv" ("id" SERIAL NOT NULL, "language" character varying NOT NULL, "tmdb_id" integer NOT NULL, "imdb_id" character varying NOT NULL, "title" character varying, "overview" character varying, "original_title" character varying NOT NULL, "original_language" character varying NOT NULL, "adult" boolean NOT NULL, "backdrop_path" character varying, "in_production" boolean NOT NULL, "homepage" character varying, "popularity" real NOT NULL, "poster_path" character varying, "first_air_date" character varying, "last_air_date" character varying, "number_of_episodes" integer NOT NULL DEFAULT '0', "number_of_seasons" integer NOT NULL DEFAULT '0', "runtime" integer, "status" character varying NOT NULL, "tagline" character varying, "type" character varying NOT NULL, "vote_average" real NOT NULL, "vote_count" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c8d0ed5100d92407e694b8a12cb" UNIQUE ("language", "tmdb_id", "imdb_id"), CONSTRAINT "PK_c422c95cb6acd5162b71e51f060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre_tvs_tv" ("genreId" integer NOT NULL, "tvId" integer NOT NULL, CONSTRAINT "PK_7a374696605cc462a2193ef544d" PRIMARY KEY ("genreId", "tvId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a9494fb79c6f7e24e20fcbeea" ON "genre_tvs_tv" ("genreId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac654b78f1e277ecf14e516aca" ON "genre_tvs_tv" ("tvId") `);
        await queryRunner.query(`ALTER TABLE "video" ADD "tvId" integer`);
        await queryRunner.query(`ALTER TABLE "video" ADD "tvSeasonId" integer`);
        await queryRunner.query(`ALTER TABLE "video" ADD "tvEpisodeId" integer`);
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
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tvEpisodeId"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tvSeasonId"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tvId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac654b78f1e277ecf14e516aca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a9494fb79c6f7e24e20fcbeea"`);
        await queryRunner.query(`DROP TABLE "genre_tvs_tv"`);
        await queryRunner.query(`DROP TABLE "tv"`);
        await queryRunner.query(`DROP TABLE "tv_season"`);
        await queryRunner.query(`DROP TABLE "tv_episode"`);
    }

}
