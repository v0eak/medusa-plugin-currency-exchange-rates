import { Lifetime } from "awilix" 
import { Currency, CurrencyService as MedusaCurrencyService } from '@medusajs/medusa';
import TaxInclusivePricingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/tax-inclusive-pricing";
import CurrencyRepository from "@medusajs/medusa/dist/repositories/currency";
import { EntityManager } from "typeorm";
import { UpdateCurrencyInput } from "../types/currency";

class CurrencyService extends MedusaCurrencyService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly currencyRepository_: typeof CurrencyRepository

    constructor(container) {
        super(container);

        this.currencyRepository_ = container.currencyRepository
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