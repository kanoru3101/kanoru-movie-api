import { MigrationInterface, QueryRunner } from "typeorm";

export class addFieldsToPersonTable1683140362469 implements MigrationInterface {
    name = 'addFieldsToPersonTable1683140362469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" ADD "birthday" character varying`);
        await queryRunner.query(`ALTER TABLE "person" ADD "deathday" character varying`);
        await queryRunner.query(`ALTER TABLE "person" ADD "known_for_department" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "known_for_department"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "deathday"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "birthday"`);
    }

}
