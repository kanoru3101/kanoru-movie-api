import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createUserTable1671720560912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'users',
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
                    name: 'name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                  name: 'password',
                  type: 'varchar',
                  isNullable: true,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
    }

}