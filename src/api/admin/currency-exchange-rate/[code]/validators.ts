import { z } from "zod"

export type AdminCreateCurrencyRatesType = z.infer<typeof AdminCreateCurrencyRates>
export const AdminCreateCurrencyRates = z.object({
    symbols: z.string().array()
})