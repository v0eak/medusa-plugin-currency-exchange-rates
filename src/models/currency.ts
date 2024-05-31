import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Currency as MedusaCurrency } from "@medusajs/medusa"
import { CurrencyExchangeRate } from "./currency-exchange-rate";

@Entity()
export class Currency extends MedusaCurrency {
    // TODO: REMOVE
    @Column({ type: 'jsonb', nullable: true})
        rates: Record<string, number> | null;

    @Column({ type: 'timestamp', nullable: true})
        rates_timestamp: Date | null;

    @OneToMany(() => CurrencyExchangeRate, cer => cer.primary_currency)
        primary_exchange_rates: CurrencyExchangeRate[];
    
    @OneToMany(() => CurrencyExchangeRate, cer => cer.secondary_currency)
        secondary_exchange_rates: CurrencyExchangeRate[];
}