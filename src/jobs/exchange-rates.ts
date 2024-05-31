import {
    type StoreService,
    type ScheduledJobConfig,
    type ScheduledJobArgs,
    Store
} from "@medusajs/medusa"
import CurrencyService from "../services/currency"

export default async function handler({
    container,
    data,
    pluginOptions,
}: ScheduledJobArgs) {
    const storeService: StoreService = container.resolve("storeService")
    const store: Store = await storeService.retrieve({
        relations: ["currencies", "default_currency"]
    })
    const currencyService: CurrencyService = container.resolve("currencyService")
    
    store.currencies.map(async (currency) => {
        const symbols = store.currencies
            .filter(c => c.code !== currency.code)
            .map(c => c.code);

        await currencyService.createCurrencyRates(currency.code, symbols)
    });
}
  
export const config: ScheduledJobConfig = {
    name: "update-currency-exchange-rates",
    schedule: "0 */2 * * *",
    data: {},
}