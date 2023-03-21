import { MigrationInterface, QueryRunner } from "typeorm";

export class fixVideoModel1678128782093 implements MigrationInterface {
    name = 'fixVideoModel1678128782093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "movie_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ADD "movie_id" character varying NOT NULL`);
    }

}
