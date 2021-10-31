import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldsToAnimeTable1635710889272 implements MigrationInterface {
    name = 'addFieldsToAnimeTable1635710889272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "animes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "animes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "animes" DROP COLUMN "created_at"`);
    }

}
