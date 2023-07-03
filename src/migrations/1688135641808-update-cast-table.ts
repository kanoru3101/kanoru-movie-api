import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCastTable1688135641808 implements MigrationInterface {
    name = 'UpdateCastTable1688135641808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" DROP COLUMN "cast_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" ADD "cast_id" integer NOT NULL`);
    }

}
