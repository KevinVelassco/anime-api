import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1643077403068 implements MigrationInterface {
    name = 'initialMigration1643077403068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "origin" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "image" character varying(400) NOT NULL, "cloud_id" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_origin_image" UNIQUE ("image"), CONSTRAINT "uq_origin_name" UNIQUE ("name"), CONSTRAINT "uq_origin_uid" UNIQUE ("uid"), CONSTRAINT "PK_f6e2cbfad6d4ed0a9cb9bb8de95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reces" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "image" character varying(400) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_race_name" UNIQUE ("name"), CONSTRAINT "uq_race_uid" UNIQUE ("uid"), CONSTRAINT "PK_01a944141263fb5b1967e0e788b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "characters" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text NOT NULL, "status" "public"."characters_status_enum" NOT NULL DEFAULT 'Alive', "gender" "public"."characters_gender_enum" NOT NULL, "profile_image" character varying(400) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "race_id" integer NOT NULL, "origin_id" integer NOT NULL, CONSTRAINT "uq_character_name" UNIQUE ("name"), CONSTRAINT "uq_character_uid" UNIQUE ("uid"), CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "uid" character varying(50) NOT NULL, "url" character varying(400) NOT NULL, "cloud_id" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_image_url" UNIQUE ("url"), CONSTRAINT "uq_image_uid" UNIQUE ("uid"), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assigned_images" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "character_id" integer NOT NULL, "image_id" integer NOT NULL, CONSTRAINT "uq_assigned_image" UNIQUE ("character_id", "image_id"), CONSTRAINT "uq_assigned_image_uid" UNIQUE ("uid"), CONSTRAINT "PK_a298ca66d79a31bc2118276c6ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_templates" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."email_templates_type_enum" NOT NULL, "file" bytea, "subject" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "uq_email_template_type" UNIQUE ("type"), CONSTRAINT "uq_email_template_uid" UNIQUE ("uid"), CONSTRAINT "PK_06c564c515d8cdb40b6f3bfbbb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verification_codes" ("id" SERIAL NOT NULL, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(20) NOT NULL, "expiration_date" TIMESTAMP NOT NULL, "type" "public"."verification_codes_type_enum" NOT NULL DEFAULT 'CONFIRM_EMAIL', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, CONSTRAINT "uq_verification_code_uid" UNIQUE ("uid"), CONSTRAINT "PK_18741b6b8bf1680dbf5057421d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "auth_uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "verified_email" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "uq_user_email" UNIQUE ("email"), CONSTRAINT "uq_user_auth_uid" UNIQUE ("auth_uid"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_fbceb34d4391b1e3adb59e65155" FOREIGN KEY ("race_id") REFERENCES "reces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_53f7112b597e71b4b6c666044c8" FOREIGN KEY ("origin_id") REFERENCES "origin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assigned_images" ADD CONSTRAINT "FK_ecf25acb6fbc74e84c5c7a8e72b" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assigned_images" ADD CONSTRAINT "FK_8a4388c8eb5275b1e728d69b3cf" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification_codes" ADD CONSTRAINT "FK_0a53c41a810420ee446082ce6c6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_0a53c41a810420ee446082ce6c6"`);
        await queryRunner.query(`ALTER TABLE "assigned_images" DROP CONSTRAINT "FK_8a4388c8eb5275b1e728d69b3cf"`);
        await queryRunner.query(`ALTER TABLE "assigned_images" DROP CONSTRAINT "FK_ecf25acb6fbc74e84c5c7a8e72b"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_53f7112b597e71b4b6c666044c8"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_fbceb34d4391b1e3adb59e65155"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "verification_codes"`);
        await queryRunner.query(`DROP TABLE "email_templates"`);
        await queryRunner.query(`DROP TABLE "assigned_images"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "characters"`);
        await queryRunner.query(`DROP TABLE "reces"`);
        await queryRunner.query(`DROP TABLE "origin"`);
    }

}
