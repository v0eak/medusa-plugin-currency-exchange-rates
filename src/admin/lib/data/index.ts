import { useAdminCustomPost } from "medusa-react"

let notify;

export const initializeNotify = (notifyFunction) => {
  notify = notifyFunction;
};

export const useCreateCurrencyRates = () => {
    const { mutate: mutateCurrencyRates } = useAdminCustomPost(
        `/currency-exchange-rate`,
        ["base_currency", "secondary_currency"]
    )
    
    const createCurrencyRates = async (currency_code: string, symbols: string[]) => {
        return mutateCurrencyRates(
            { currency_code, symbols },
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