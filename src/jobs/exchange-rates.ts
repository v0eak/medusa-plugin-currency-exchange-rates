import {
    type StoreService,
    type ScheduledJobConfig,
    type ScheduledJobArgs,
    Store
} from "@medusajs/medusa"
import axios, { AxiosResponse } from "axios"
import CurrencyService from "../services/currency"
import { apiResponseType } from "../types/api"

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

    const promises = store.currencies.map(currency => {
        const otherCurrencies = store.currencies.filter(c => c.code !== currency.code);
        const symbols = otherCurrencies.map(c => c.code).join(',');

        return axios.get(`http://api.exchangeratesapi.io/v1/latest`, {
            params: {
                access_key: pluginOptions.apiKey,
                base: currency.code,
                symbols: symbols
            }
        })
    });

    const responses = await Promise.allSettled(promises);
    const responseData: apiResponseType[] = responses
        .filter(response => response.status === 'fulfilled') // remove rejected promises
        .map(response => (response as PromiseFulfilledResult<AxiosResponse>).value.data);

    for (const apiData of responseData) {
        await currencyService.update(apiData.base, {
            rates: apiData.rates,
            rate_timestamp: apiData.timestamp
        });
    }
}
  
export const config: ScheduledJobConfig = {
    name: "update-currency-exchange-rates",
    schedule: "* */2 * * *",
    data: {},
}