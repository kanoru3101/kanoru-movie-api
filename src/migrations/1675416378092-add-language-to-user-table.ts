import { MigrationInterface, QueryRunner } from "typeorm"

export class addLanguageToUserTable1675416378092 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "language" varchar NOT NULL DEFAULT 'en';`)
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "timezone" varchar;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('user', ['language', 'timezone']);
    }

}
