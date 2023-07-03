import { MigrationInterface, QueryRunner } from "typeorm";

export class castTableChangeUniqueIndex1682527792518 implements MigrationInterface {
    name = 'castTableChangeUniqueIndex1682527792518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "FK_c5b5f564a9ac9f7ddaea872a3b7"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "UQ_d3dffb166e92878dcbc4f1dc517"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "UQ_864dca7446e16b5f19e19ba68eb"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "UQ_08c2355f81365d89ec410ae94ed"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP COLUMN "person_id"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP COLUMN "movie_id"`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "UQ_c2c9bc7a595b3eb8d8678b32fab" UNIQUE ("credit_id", "personId", "movieId")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "UQ_906beabb1cf7408e202a010fd01" UNIQUE ("credit_id", "movieId")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "UQ_850406b875521f3b421ea098f43" UNIQUE ("credit_id", "personId")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "FK_c5b5f564a9ac9f7ddaea872a3b7" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "FK_c5b5f564a9ac9f7ddaea872a3b7"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "UQ_850406b875521f3b421ea098f43"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "UQ_906beabb1cf7408e202a010fd01"`);
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "UQ_c2c9bc7a595b3eb8d8678b32fab"`);
        await queryRunner.query(`ALTER TABLE "cast" ADD "movie_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cast" ADD "person_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "UQ_08c2355f81365d89ec410ae94ed" UNIQUE ("credit_id", "person_id")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "UQ_864dca7446e16b5f19e19ba68eb" UNIQUE ("credit_id", "movie_id")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "UQ_d3dffb166e92878dcbc4f1dc517" UNIQUE ("credit_id", "person_id", "movie_id")`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "FK_c5b5f564a9ac9f7ddaea872a3b7" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
