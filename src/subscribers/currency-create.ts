import axios from "axios"
import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import StoreService from "../services/store"
import CurrencyService from "../services/currency"
import { apiResponseType } from "../types/api"
  
export default async function AuctionBidCreateHandler({ data, eventName, container, pluginOptions }: SubscriberArgs<Record<string, any>>) {
    const currencyService: CurrencyService = container.resolve("currencyService")

    const [currencies, count] = await currencyService.listAndCount({})

    const symbols = currencies
        .filter(c => c.code !== data.code)
        .map(c => c.code).join(',');

    const promise: apiResponseType = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=${pluginOptions.apiKey}&base=${data.code}&symbols=${symbols}`);

    await currencyService.update(promise.base, {
        rates: promise.rates,
        rate_timestamp: promise.timestamp
    });
}
  
export const config: SubscriberConfig = {
    event: StoreService.Events.CURRENCY_CREATED,
    context: {
        subscriberId: "currency.created",
    },
}