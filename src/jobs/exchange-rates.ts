import {
    type StoreService,
    type ScheduledJobConfig,
    type ScheduledJobArgs,
    Store
} from "@medusajs/medusa"
import CurrencyExchangeRateService from "../services/currency-exchange-rate"

export default async function handler({
    container,
    data,
    pluginOptions,
}: ScheduledJobArgs) {
    const storeService: StoreService = container.resolve("storeService")
    const store: Store = await storeService.retrieve({
        relations: ["currencies", "default_currency"]
    })
    const exchangeRateService: CurrencyExchangeRateService = container.resolve("currencyExchangeRateService")
    
    const promises = store.currencies.map(async (currency) => {
        const symbols = store.currencies
            .filter(c => c.code !== currency.code)
            .map(c => c.code);

        return await exchangeRateService.createCurrencyRates(currency.code, symbols)
    });

    const results = await Promise.allSettled(promises)
    const rejectedResults = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    rejectedResults.forEach(result => {
        console.error(`Failed to process currency rates: `, result.reason);
    })
}

export const config: ScheduledJobConfig = {
    name: "update-currency-exchange-rates",
    schedule: "0 */2 * * *",
    data: {},
}