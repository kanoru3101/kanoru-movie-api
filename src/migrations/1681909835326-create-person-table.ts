import { MigrationInterface, QueryRunner } from "typeorm";

export class createPersonTable1681909835326 implements MigrationInterface {
    name = 'createPersonTable1681909835326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "language" character varying NOT NULL, "movie_db_id" integer NOT NULL, "imdb_id" character varying NOT NULL, "name" character varying NOT NULL, "biography" character varying NOT NULL, "gender" integer NOT NULL DEFAULT '0', "popularity" real NOT NULL, "place_of_birth" character varying, "profile_path" character varying, "adult" boolean NOT NULL, "homepage" character varying, "poster_path" character varying, "also_known_as" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_110236b510fa6dfa2afaf38d50d" UNIQUE ("language", "movie_db_id", "imdb_id"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
