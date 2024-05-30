import { UpdateCurrencyInput as MedusaUpdateCurrencyInput } from "@medusajs/medusa/dist/types/currency";

export interface UpdateCurrencyInput extends MedusaUpdateCurrencyInput {
    rates?: Record<string, number> | null;
    rate_timestamp?: number | null;
}