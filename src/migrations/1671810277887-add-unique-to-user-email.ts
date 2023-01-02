import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm"

export class addUniqueToUserEmail1671810277887 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('user', 'email', new TableColumn({
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true
        }))


        await queryRunner.addColumn('user', new TableColumn({
            name: 'slug',
            type: 'varchar',
            isNullable: false,
            isUnique: true
        }))

        await queryRunner.createIndices('user', [
            new TableIndex({
                columnNames: ['slug'],
                isUnique: true,
            }),
            new TableIndex({
                columnNames: ['email'],
                isUnique: true,
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('user', 'email', new TableColumn({
            name: 'email',
            type: 'varchar',
            isNullable: false,
        }))

        await queryRunner.dropColumn('user', 'slug');

        await queryRunner.dropIndices('user', [
            new TableIndex({
                columnNames: ['slug'],
                isUnique: true,
            }),
            new TableIndex({
                columnNames: ['email'],
                isUnique: true,
            })
        ])
    }

}
