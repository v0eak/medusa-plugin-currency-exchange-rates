import { UpdateCurrencyInput as MedusaUpdateCurrencyInput } from "@medusajs/medusa/dist/types/currency";

export interface UpdateCurrencyInput extends MedusaUpdateCurrencyInput {
    rates?: Record<string, number> | null;
    rates_timestamp?: number | null;
}