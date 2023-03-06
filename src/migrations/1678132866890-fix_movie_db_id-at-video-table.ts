import { MigrationInterface, QueryRunner } from "typeorm";

export class fixMovieDbIdAtVideoTable1678132866890 implements MigrationInterface {
    name = 'fixMovieDbIdAtVideoTable1678132866890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "UQ_3f1cb98952434c9bc86381b32ae"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "UQ_3f1cb98952434c9bc86381b32ae" UNIQUE ("movie_db_id")`);
    }

}
