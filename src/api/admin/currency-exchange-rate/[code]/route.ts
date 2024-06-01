import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CurrencyExchangeRateService from "../../../../services/currency-exchange-rate";
import { AdminCreateCurrencyRates, AdminCreateCurrencyRatesType } from "./validators";

export const POST = async (
    req: MedusaRequest<AdminCreateCurrencyRatesType>,
    res: MedusaResponse
) => {
    const exchangeRateService: CurrencyExchangeRateService = req.scope.resolve("currencyExchangeRateService")
    const body: AdminCreateCurrencyRatesType = AdminCreateCurrencyRates.parse(req.body)
    const currency_code = req.params.code
    const { symbols } = body

    const currency = await exchangeRateService.createCurrencyRates(
        currency_code,
        symbols
    )

    res.status(200).json({
        currency
    })
}