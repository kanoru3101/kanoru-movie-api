import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableLogs1671547461802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'logs',
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
          {
            name: 'message',
            type: 'jsonb',
            isNullable: false,
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('logs')
  }
}
