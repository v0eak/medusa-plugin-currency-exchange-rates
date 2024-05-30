import { MigrationInterface, QueryRunner } from "typeorm";

export class CurrencyExchangeRates1709056275263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" ADD COLUMN "rates" jsonb`);

        await queryRunner.query(`ALTER TABLE "currency" ADD COLUMN "rates_timestamp" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "rates"`);

        await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "rates_timestamp"`);
    }

}