import { MigrationInterface, QueryRunner } from "typeorm";

export class First1688910992635 implements MigrationInterface {
    name = 'First1688910992635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "balance" integer NOT NULL, "userId" uuid NOT NULL, "currencyId" uuid NOT NULL, "test" character varying NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "currencyCode" character varying NOT NULL, CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "salt" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "price" integer NOT NULL, "validUntil" character varying NOT NULL, "isAccepted" boolean NOT NULL DEFAULT false, "rateId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_7d003ded589e099549aab1458d" UNIQUE ("rateId"), CONSTRAINT "REL_e8100751be1076656606ae045e" UNIQUE ("userId"), CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "ratePrice" integer NOT NULL, "markupRatePrice" integer NOT NULL, "sourceId" uuid NOT NULL, "targetId" uuid NOT NULL, CONSTRAINT "PK_2618d0d38af322d152ccc328f33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7d003ded589e099549aab1458dc" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_e8100751be1076656606ae045e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_e8100751be1076656606ae045e3"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7d003ded589e099549aab1458dc"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`DROP TABLE "rate"`);
        await queryRunner.query(`DROP TABLE "offer"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "currency"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
