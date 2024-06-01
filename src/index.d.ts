import { CurrencyExchangeRate } from "./models/currency-exchange-rate";

export declare module "@medusajs/medusa/dist/models/currency" {
    declare interface Currency {
        exchange_rates: CurrencyExchangeRate[];
    }
}