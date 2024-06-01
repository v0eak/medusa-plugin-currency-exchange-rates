import { Lifetime } from "awilix"
import { Repository } from "typeorm";
import { Currency as MedusaCurrency, TransactionBaseService } from '@medusajs/medusa';
import { MedusaError, isDefined } from "medusa-core-utils";
import { apiResponseErrorType, apiResponseType } from "../types/api";
import axios from "axios";
import { CurrencyExchangeRate } from "../models/currency-exchange-rate";

class CurrencyExchangeRateService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly currencyRepository_: Repository<MedusaCurrency>
    protected readonly currencyExchangeRateRepository_: Repository<CurrencyExchangeRate>
    protected readonly apiKey: string

    constructor(container, options) {
        super(container);
        this.apiKey = options.apiKey

        this.currencyRepository_ = container.manager.getRepository("Currency")
        this.currencyExchangeRateRepository_ = container.manager.getRepository("CurrencyExchangeRate")
    }

    async createCurrencyRates(
        code: string,
        symbols: string[]
    ): Promise<CurrencyExchangeRate[]> {
        return await this.atomicPhase_(async (manager) => {
            const currencyRepo = this.activeManager_.withRepository(this.currencyRepository_)
            const exchangeRateRepo = this.activeManager_.withRepository(this.currencyExchangeRateRepository_);
    
            // Validate Data

            if (!isDefined(symbols)) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `"symbols" must be defined`
                )
            }

            const currency = await currencyRepo.findOne({
                where: { code: code.toLowerCase() }
            })

            if (!currency) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Currency code missing`
                )
            }

            // Fetch Rates
    
            const response = await axios.get<apiResponseType>(`http://api.exchangeratesapi.io/v1/latest`, {
                params: {
                    access_key: this.apiKey,
                    base: code,
                    symbols: symbols.filter(c => c !== code).join(',')
                }
            })
            const responseData = response.data;
    
            if (!responseData.success) {
                console.log("Eignetlih ajosoifaisf")
                throw new Error(`Error ${(responseData as apiResponseErrorType).error.code}: ${(responseData as apiResponseErrorType).error.info}`)
            }

            // Create / Update Row

            const rates: CurrencyExchangeRate[] = []

            for (const [secondaryCurrencyCode, rate] of Object.entries(responseData.rates)) {
                const secondaryCurrency = await currencyRepo.findOne({
                    where: { code: secondaryCurrencyCode.toLowerCase() }
                });
                if (!secondaryCurrency) {
                    continue
                }

                let exchangeRate = await exchangeRateRepo.findOne({
                    where: {
                        base_currency: currency,
                        secondary_currency: secondaryCurrency
                    }
                })

                const timestampAsDate = new Date(responseData.timestamp * 1000)

                if (exchangeRate) {
                    if (exchangeRate.timestamp === timestampAsDate) {
                        continue
                    }
                    
                    exchangeRate.exchange_rate = rate
                    exchangeRate.timestamp = timestampAsDate
                } else {
                    exchangeRate = exchangeRateRepo.create({
                        base_currency: currency,
                        secondary_currency: secondaryCurrency,
                        exchange_rate: rate,
                        timestamp: timestampAsDate
                    });
                }

                await exchangeRateRepo.save(exchangeRate);

                rates.push(exchangeRate)
            }

            return rates
        })
    }
}

export default CurrencyExchangeRateService