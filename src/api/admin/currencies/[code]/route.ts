import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CurrencyService from "../../../../services/currency";
import { AdminCreateCurrencyRates, AdminCreateCurrencyRatesType } from "./validators";

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const currencyService: CurrencyService = req.scope.resolve("currencyService")
    const currency_code = req.params.code
    const body: AdminCreateCurrencyRatesType = AdminCreateCurrencyRates.parse(req.body)
    const { symbols } = body

    const currency = await currencyService.createCurrencyRates(
        currency_code,
        symbols
    )

    res.status(200).json({
        currency
    })
}