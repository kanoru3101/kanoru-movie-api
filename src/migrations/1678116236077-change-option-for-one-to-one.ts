import { MigrationInterface, QueryRunner } from "typeorm";

export class changeOptionForOneToOne1678116236077 implements MigrationInterface {
    name = 'changeOptionForOneToOne1678116236077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_e59764a417d4f8291747b744faa"`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_e59764a417d4f8291747b744faa" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_e59764a417d4f8291747b744faa"`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_e59764a417d4f8291747b744faa" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
