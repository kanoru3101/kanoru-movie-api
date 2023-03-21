import { MigrationInterface, QueryRunner } from "typeorm";

export class fix1677699844641 implements MigrationInterface {
    name = 'fix1677699844641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "revenue"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "revenue" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "revenue"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "revenue" bigint NOT NULL`);
    }

}
