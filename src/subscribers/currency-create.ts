import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import StoreService from "../services/store"
import CurrencyService from "../services/currency"
  
// This subscriber is unnecessary
// because due to how medusajs is structured, it will most likely never be triggered
export default async function CurrencyCreateHandler({ data, eventName, container, pluginOptions }: SubscriberArgs<Record<string, any>>) {
    const currencyService: CurrencyService = container.resolve("currencyService")

    const [currencies, count] = await currencyService.listAndCount({})

    const symbols = currencies
        .filter(c => c.code !== data.code)
        .map(c => c.code);

    await currencyService.createCurrencyRates(data.code, symbols)
}
  
export const config: SubscriberConfig = {
    event: StoreService.Events.CURRENCY_CREATED,
    context: {
        subscriberId: "currency.created",
    },
}