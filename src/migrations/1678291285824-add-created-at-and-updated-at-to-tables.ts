import { MigrationInterface, QueryRunner } from "typeorm";

export class addCreatedAtAndUpdatedAtToTables1678291285824 implements MigrationInterface {
    name = 'addCreatedAtAndUpdatedAtToTables1678291285824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "genre" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "genre" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "genre" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "created_at"`);
    }

}
