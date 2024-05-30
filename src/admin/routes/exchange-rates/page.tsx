import { RouteConfig, RouteProps } from "@medusajs/admin"
import { useAdminStore } from "medusa-react"
import { Container, Heading, ProgressAccordion, Badge } from "@medusajs/ui"
import { CurrencyDollar } from "@medusajs/icons"
import { Currency } from "@medusajs/medusa"

const ExchangeRatepage = ({notify}: RouteProps) => {
    const {
        store,
        isLoading
    } = useAdminStore()

    console.log(store)

    // TODO: Add a button that updates all exchange rates,
    // TODO: add a button to each currency to update only the one exchange rate

    return (
        <Container>
            <div className="mb-xlarge">
                <div className="flex items-center justify-between">
                    <Heading level="h3" className="inter-xlarge-semibold text-grey-90">Exchange Rates</Heading>
                </div>
                <span className="inter-small-regular text-grey-50 pt-1.5">See all saved Exchange Rates and Information</span>
                {isLoading && <span>Loading...</span>}
                <ProgressAccordion type="single">
                    {store && store.currencies.map((currency: Currency) => (
                        <ProgressAccordion.Item key={currency.code} value={currency.name}>
                            <ProgressAccordion.Header>{currency.rates && currency.rates_timestamp && new Date(currency.rates_timestamp).toLocaleString()} {currency.name}</ProgressAccordion.Header>
                            <ProgressAccordion.Content className="flex flex-col gap-y-2 pb-2">
                                {currency.rates && Object.entries(currency.rates).map(([key, value]) => (
                                    <div key={key + value} className="flex gap-x-2">
                                        <Badge>{key}</Badge>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </ProgressAccordion.Content>
                        </ProgressAccordion.Item>
                    ))}
                </ProgressAccordion>
            </div>
        </Container>
    )
}

export const config: RouteConfig = {
    link: {
        label: "Exchange Rates",
        icon: CurrencyDollar
    }
}

export default ExchangeRatepage