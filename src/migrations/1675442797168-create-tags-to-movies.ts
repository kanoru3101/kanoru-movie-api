import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createTagsToMovies1675442797168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
          name: 'movie_genre',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isUnique: true,
              generationStrategy: 'uuid',
              default: `uuid_generate_v4()`,
            },
            {
              isPrimary: true,
              name: 'movie_id',
              type: 'uuid'
            },
            {
              isPrimary: true,
              name: 'genre_id',
              type: 'uuid'
            },
          ],
          foreignKeys: [
            {
              columnNames: ['movie_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'movie',
            },
            {
              columnNames: ['genre_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'genre',
            },
          ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('movie_genre');
    }

}
