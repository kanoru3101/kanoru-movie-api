import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class createMoviesTable1675431705157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'movie',
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
                    isUnique: true,
                },
                {
                    name: 'imdb_id',
                    type: 'integer',
                    isUnique: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'overview',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'title_ua',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'overview_ua',
                    type: 'varchar',
                    isNullable: true,
                },      
                {
                    name: 'original_title',
                    type: 'varchar',
                },   
                {
                    name: 'original_language',
                    type: 'varchar',
                },   
                {
                    name: 'adult',
                    type: 'boolean',
                },
                {
                    name: 'backdrop_path',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'budget',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'homepage',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'popularity',
                    type: 'integer',
                },   
                {
                    name: 'poster_path',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'release_date',
                    type: 'varchar',
                },
                {
                    name: 'revenue',
                    type: 'integer',
                },    {
                    name: 'runtime',
                    type: 'integer',
                    isNullable: true,
                },    {
                    name: 'status',
                    type: 'varchar',
                },    {
                    name: 'tagline',
                    type: 'varchar',
                    isNullable: true,
                },    {
                    name: 'video',
                    type: 'boolean',
                },    {
                    name: 'vote_average',
                    type: 'integer',
                },
                {
                    name: 'vote_count',
                    type: 'integer',
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
        await queryRunner.createIndices('movie', [
            new TableIndex({
                columnNames: ['movie_db_id'],
                isUnique: true,
            }),
            new TableIndex({
                columnNames: ['imdb_id'],
                isUnique: true,
            }),
            new TableIndex({
                columnNames: ['title'],
            }),
            new TableIndex({
                columnNames: ['title_ua'],
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('movie')
    }

}
