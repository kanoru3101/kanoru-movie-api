import { MigrationInterface, QueryRunner } from "typeorm";

export class createCascadeUpdate1682522583511 implements MigrationInterface {
    name = 'createCascadeUpdate1682522583511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "FK_dcacf1ce3d9cc81bc6427f0f6b3"`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "FK_dcacf1ce3d9cc81bc6427f0f6b3" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cast" DROP CONSTRAINT "FK_dcacf1ce3d9cc81bc6427f0f6b3"`);
        await queryRunner.query(`ALTER TABLE "cast" ADD CONSTRAINT "FK_dcacf1ce3d9cc81bc6427f0f6b3" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
