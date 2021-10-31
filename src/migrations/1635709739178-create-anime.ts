import {MigrationInterface, QueryRunner} from "typeorm";

export class createAnime1635709739178 implements MigrationInterface {
    name = 'createAnime1635709739178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "animes" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "uq_name" UNIQUE ("name"), CONSTRAINT "uq_uid" UNIQUE ("uid"), CONSTRAINT "PK_16b5c3f560dac36ec440e340545" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "animes"`);
    }

}
