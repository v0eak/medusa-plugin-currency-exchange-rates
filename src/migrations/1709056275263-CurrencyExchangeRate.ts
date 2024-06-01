import { MigrationInterface, QueryRunner } from "typeorm";

export class CurrencyExchangeRate1709056275263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency_exchange_rate" (
            "id" character varying NOT NULL,
            "base_currency_id" character varying NOT NULL,
            "secondary_currency_id" character varying NOT NULL,
            "exchange_rate" NUMERIC NOT NULL,
            "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            UNIQUE ("base_currency_id", "secondary_currency_id"));

            ALTER TABLE "currency_exchange_rate"
                ADD CONSTRAINT "currency_exchange_rates_base_currency_id_fkey"
                FOREIGN KEY ("base_currency_id") REFERENCES "currency" ("code") ON DELETE CASCADE;

            ALTER TABLE "currency_exchange_rate"
                ADD CONSTRAINT "currency_exchange_rates_secondary_currency_id_fkey"
                FOREIGN KEY ("secondary_currency_id") REFERENCES "currency" ("code") ON DELETE CASCADE;
        `);

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency_exchange_rate";`)
    }

}