import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Currency as MedusaCurrency } from "@medusajs/medusa"
import { CurrencyExchangeRate } from "./currency-exchange-rate";

@Entity()
export class Currency extends MedusaCurrency {
    @OneToMany(() => CurrencyExchangeRate, cer => cer.base_currency)
        exchange_rates: CurrencyExchangeRate[];
}