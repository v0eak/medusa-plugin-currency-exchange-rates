import { Lifetime } from "awilix"
import { EntityManager } from "typeorm";
import TaxInclusivePricingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/tax-inclusive-pricing";
import { Currency, CurrencyService as MedusaCurrencyService } from '@medusajs/medusa';
import { MedusaError, isDefined } from "medusa-core-utils";
import CurrencyRepository from "@medusajs/medusa/dist/repositories/currency";
import { UpdateCurrencyInput } from "../types/currency";
import { apiResponseErrorType, apiResponseSuccessType, apiResponseType } from "../types/api";
import axios from "axios";

class CurrencyService extends MedusaCurrencyService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly currencyRepository_: typeof CurrencyRepository
    protected readonly apiKey: string

    constructor(container, options) {
        super(container);
        this.apiKey = options.apiKey

        this.currencyRepository_ = container.currencyRepository
    }

    async createCurrencyRates(
        code: string,
        symbols: string[]
    ): Promise<Currency | undefined | never> {
        if (!isDefined(code)) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `"code" must be defined`
            )
        }

        if (!isDefined(symbols)) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `"symbols" must be defined`
            )
        }

        const response = await axios.get<apiResponseType>(`https://api.exchangeratesapi.io/v1/latest`, {
            params: {
                access_key: this.apiKey,
                base: code,
                symbols: symbols.filter(c => c !== code).join(',')
            }
        })
        const responseData = response.data;

        if (!responseData.success) {
            throw new Error(`Error ${(responseData as apiResponseErrorType).error.code}: ${(responseData as apiResponseErrorType).error.info}`)
        }

        return await this.update(code, {
            rates: responseData.rates,
            rate_timestamp: responseData.timestamp
        })
    }

    async update(
        code: string,
        data: UpdateCurrencyInput
    ): Promise<Currency | undefined | never> {
        return await this.atomicPhase_(async (manager: EntityManager) => {
            const currency = await this.retrieveByCode(code)
    
            if (
                this.featureFlagRouter_.isFeatureEnabled(
                    TaxInclusivePricingFeatureFlag.key
                )
            ) {
                if (typeof data.includes_tax !== "undefined") {
                    currency.includes_tax = data.includes_tax
                }
            }

            if (typeof data.rates !== "undefined" && typeof data.rate_timestamp !== "undefined") {
                currency.rates = data.rates
                currency.rates_timestamp = new Date(data.rate_timestamp * 1000)
            }
    
            const currencyRepo = manager.withRepository(
                this.currencyRepository_
            )
            await currencyRepo.save(currency)
    
            await this.eventBusService_
                .withTransaction(manager)
                .emit(CurrencyService.Events.UPDATED, {
                    code,
                })
    
            return currency
        })
    }
}

export default CurrencyService