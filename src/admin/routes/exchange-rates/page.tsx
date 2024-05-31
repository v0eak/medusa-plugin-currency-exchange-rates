import { useEffect, useState } from "react"
import { Currency } from "@medusajs/medusa"
import { RouteConfig, RouteProps } from "@medusajs/admin"
import { useAdminStore } from "medusa-react"
import { Container, Heading, ProgressAccordion, Badge, Button, Table } from "@medusajs/ui"
import { CurrencyDollar } from "@medusajs/icons"
import { initializeNotify, useCreateCurrencyRates } from "../../lib/data"

const ExchangeRatepage = ({notify}: RouteProps) => {
    const {
        store,
        isLoading
    } = useAdminStore()
    const [currencyData, setCurrencyData] = useState({ currencyCode: null, symbols: [] });

    const createCurrencyRates = useCreateCurrencyRates(currencyData.currencyCode);

    const handleCreateCurrencyRates = (currencyCode: string) => {
        const symbols = store.currencies.filter(c => c.code !== currencyCode).map(c => c.code);
        setCurrencyData({ currencyCode, symbols });
    };

    useEffect(() => {
        initializeNotify(notify)
    }, [])

    useEffect(() => {
        if (currencyData.currencyCode && currencyData.symbols.length > 0) {
            createCurrencyRates(currencyData.symbols);
        }
    }, [currencyData]);

    // TODO: Add a button that updates all exchange rates,
    // TODO: if timestamp is older than 12 hours, mark it as red!

    return (
        <Container>
            <div className="mb-xlarge">
                <div className="flex flex-col pb-1">
                    <div className="flex items-center justify-between gap-x-2">
                        <Heading level="h3" className="inter-xlarge-semibold text-grey-90">Exchange Rates</Heading>
                        {store && (
                            <Button
                                size="small"
                                variant="secondary"
                                onClick={() => store.currencies.map((c: Currency) => handleCreateCurrencyRates(c.code))}
                            >
                                Update all Exchange Rates
                            </Button>
                        )}
                    </div>
                    <span className="inter-small-regular text-grey-50 pt-1.5">See all saved Exchange Rates and Information</span>
                </div>
                {isLoading && <span>Loading...</span>}
                <ProgressAccordion type="multiple">
                    {store && store.currencies.map((currency: Currency) => (
                        <ProgressAccordion.Item key={currency.code} value={currency.name}>
                            <ProgressAccordion.Header>
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center gap-x-2">
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            onClick={() => handleCreateCurrencyRates(currency.code)}
                                        >
                                            Update
                                        </Button>
                                        <span>{currency.name}</span>
                                    </div>
                                    {currency.rates_timestamp && (
                                        <Badge size="xsmall">
                                            {new Date(currency.rates_timestamp).toLocaleString()}
                                        </Badge>
                                    )}
                                </div>
                            </ProgressAccordion.Header>
                            <ProgressAccordion.Content className="flex flex-col gap-y-2 pb-2">
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Code</Table.HeaderCell>
                                            <Table.HeaderCell>Exchange Rate</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {currency.rates && Object.entries(currency.rates).map(([key, value]) => (
                                            <Table.Row>
                                                <Table.Cell><Badge size="xsmall">{key}</Badge></Table.Cell>
                                                <Table.Cell><span>{value}</span></Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>

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