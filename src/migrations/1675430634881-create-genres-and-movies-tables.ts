import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class createGenresAndMoviesTables1675430634881 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'genre',
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
                    name: 'movie_db_id',
                    type: 'integer',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'name_ua',
                    type: 'varchar',
                },
                {
                    default: 'now()',
                    name: 'createdAt',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                  default: 'now()',
                  name: 'updatedAt',
                  type: 'timestamp',
                  isNullable: false,
                },
              ],
            }),
            true
        )
        await queryRunner.createIndices('genre', [
            new TableIndex({
                columnNames: ['movie_db_id'],
                isUnique: true,
            }),
            new TableIndex({
                columnNames: ['name'],
                isUnique: true,
            }),
            new TableIndex({
                columnNames: ['name_ua'],
                isUnique: true,
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('genre')
    }

}
