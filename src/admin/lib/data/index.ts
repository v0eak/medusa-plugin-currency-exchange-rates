import { useAdminCustomPost } from "medusa-react"

let notify;

export const initializeNotify = (notifyFunction) => {
  notify = notifyFunction;
};

export const useCreateCurrencyRates = (currencyCode: string) => {
    const { mutate: mutateCurrencyRates } = useAdminCustomPost(
        `/currency-exchange-rate/${currencyCode}`,
        ["base_currency", "secondary_currency"]
    )
    
    const createCurrencyRates = async (symbols: string[]) => {
        return mutateCurrencyRates(
            { symbols },
            {
                onSuccess: (data: any) => {
                    // Handle successful responses
                    notify.success("Success", "Successfully created Curreny Exchange Rates!")
                    return data.feature_displays
                },
                onError: (error) => {
                    // Handle non-successful responses (e.g., 404, 500, etc.)
                    notify.error("Error", `Failed to create Currency Exchange Rates. ${error}`)
                    throw new Error(`Failed to create Currency Exchange Rates. ${error}`)
                },
            }
        )
    }

    return createCurrencyRates
}