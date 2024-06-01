import { Lifetime } from "awilix" 
import { Store as MedusaStore, StoreService as MedusaStoreService } from '@medusajs/medusa';
import { MedusaError } from "medusa-core-utils";
import { EntityManager } from "typeorm";

class StoreService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED

    static readonly Events = {
        CURRENCY_CREATED: "currency.created"
    }

    constructor(container) {
        super(container);
    }

    // UNFORTUNATELY THIS FUNCTION WILL NEVER EVER BE TRIGGERED, BECAUSE
    // 1) It is never used by medusa's core
    // 2) the admin panel uses medusa-react which directly inserts into the database instead of relying on services
    // thanks, medusa
    async addCurrency(code: string): Promise<MedusaStore | never> {
        return await this.atomicPhase_(
          async (transactionManager: EntityManager) => {
            const storeRepo = transactionManager.withRepository(
              this.storeRepository_
            )
            const currencyRepository = transactionManager.withRepository(
              this.currencyRepository_
            )
    
            const curr = await currencyRepository.findOne({
              where: { code: code.toLowerCase() },
            })
    
            if (!curr) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Currency ${code} not found`
              )
            }
    
            const store = await this.retrieve({ relations: ["currencies"] })
    
            const doesStoreInclCurrency = store.currencies
              .map((c) => c.code.toLowerCase())
              .includes(curr.code.toLowerCase())
            if (doesStoreInclCurrency) {
              throw new MedusaError(
                MedusaError.Types.DUPLICATE_ERROR,
                `Currency already added`
              )
            }
    
            store.currencies = [...store.currencies, curr]

            await this.eventBus_
                .withTransaction(transactionManager)
                .emit(StoreService.Events.CURRENCY_CREATED, {
                    code: curr.code
                })
            return await storeRepo.save(store)
          }
        )
      }

}

export default StoreService