import { z } from "zod"

export type AdminCreateCurrencyRatesType = z.infer<typeof AdminCreateCurrencyRates>
export const AdminCreateCurrencyRates = z.object({
    currency_code: z.string(),
    symbols: z.string().array()
})