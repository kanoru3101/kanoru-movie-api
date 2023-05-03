import { MigrationInterface, QueryRunner } from "typeorm";

export class createCastTable1682513575543 implements MigrationInterface {
    name = 'createCastTable1682513575543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "UQ_110236b510fa6dfa2afaf38d50d"`);
        await queryRunner.query(`CREATE TABLE "cast" ("id" SERIAL NOT NULL, "credit_id" character varying NOT NULL, "person_id" integer NOT NULL, "movie_id" integer NOT NULL, "character" character varying NOT NULL, "gender" integer, "order" integer NOT NULL, "adult" boolean NOT NULL, "known_for_department" character varying NOT NULL, "cast_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "movieId" integer, "personId" integer, CONSTRAINT "UQ_d3dffb166e92878dcbc4f1dc517" UNIQUE ("credit_id", "person_id", "movie_id"), CONSTRAINT "UQ_864dca7446e16b5f19e19ba68eb" UNIQUE ("credit_id", "movie_id"), CONSTRAINT "UQ_08c2355f81365d89ec410ae94ed" UNIQUE ("credit_id", "person_id"), CONSTRAINT "PK_c27b51350cb072d995c340b86b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "movie_db_id"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "poster_path"`);
        await queryRunner.query(`ALTER TABLE "person" ADD "tmdb_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "UQ_f03bcaba30de87a230a0bb069c3" UNIQUE ("language", "tmdb_id", "imdb_id")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "FK_dcacf1ce3d9cc81bc6427f0f6b3" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "FK_c5b5f564a9ac9f7ddaea872a3b7" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "FK_c5b5f564a9ac9f7ddaea872a3b7"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "FK_dcacf1ce3d9cc81bc6427f0f6b3"`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "UQ_f03bcaba30de87a230a0bb069c3"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "person" ADD "poster_path" character varying`);
        await queryRunner.query(`ALTER TABLE "person" ADD "movie_db_id" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "cast"`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "UQ_110236b510fa6dfa2afaf38d50d" UNIQUE ("language", "movie_db_id", "imdb_id")`);
    }

}
