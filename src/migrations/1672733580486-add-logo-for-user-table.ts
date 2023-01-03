import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class addLogoForUserTable1672733580486 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user', new TableColumn({
            name: 'logo',
            type: 'varchar',
            isNullable: true,
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'logo')
    }

}
