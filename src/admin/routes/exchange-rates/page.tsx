import { useEffect, useState } from "react"
import { Currency as MedusaCurrency, Store } from "@medusajs/medusa"
import { RouteConfig, RouteProps } from "@medusajs/admin"
import { useAdminCustomQuery, useAdminStore } from "medusa-react"
import { Container, Heading, ProgressAccordion, Badge, Button, Table } from "@medusajs/ui"
import { CurrencyDollar } from "@medusajs/icons"
import { initializeNotify, useCreateCurrencyRates } from "../../lib/data"

const ExchangeRatepage = ({notify}: RouteProps) => {
    const {
        store,
        isLoading,
        refetch
    } = useAdminStore()

    const createCurrencyRates = useCreateCurrencyRates()

    const createSymbols = (currency_code: string, currencies: MedusaCurrency[]) => {
        return currencies
            .filter(currency => currency.code !== currency_code)
            .map(currency => currency.code);
    };
    
    const updateAllRates = (currencies: MedusaCurrency[]) => {
        currencies.map(async (currency) => {
            const symbols = createSymbols(currency.code, currencies);
    
            return await createCurrencyRates(currency.code, symbols)
        });

        return refetch()
    }

    const findMissingExchangeRates = (currency: MedusaCurrency, storeCurrencies: MedusaCurrency[]) => {
        const allCurrencyCodes = storeCurrencies.map(c => c.code);
        const existingExchangeRates = currency.exchange_rates.map(er => er.secondary_currency.code);
        const missingExchangeRates = allCurrencyCodes.filter(code => code !== currency.code && !existingExchangeRates.includes(code));
        return missingExchangeRates;
    };

    useEffect(() => {
        initializeNotify(notify);
    }, []);

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
                                onClick={() => updateAllRates(store.currencies)}
                            >
                                Update all Exchange Rates
                            </Button>
                        )}
                    </div>
                    <span className="inter-small-regular text-grey-50 pt-1.5">See all saved Exchange Rates and Information</span>
                </div>
                {isLoading && <span>Loading...</span>}
                <ProgressAccordion type="multiple">
                    {store && store.currencies.map((currency: MedusaCurrency) => (
                        <ProgressAccordion.Item key={currency.code} value={currency.name}>
                            <ProgressAccordion.Header>
                                <div className="flex items-center gap-x-2">
                                    <Button
                                        size="small"
                                        variant={(currency.exchange_rates && currency.exchange_rates?.some((er) => (new Date(er.timestamp).getTime() + (12 * 60 * 60 * 1000)) < Date.now())
                                            || currency.exchange_rates && currency.exchange_rates.length < store.currencies.length - 1) ? "danger" : "secondary"}
                                        onClick={() => {createCurrencyRates(currency.code, createSymbols(currency.code, store.currencies)), refetch()}}
                                    >
                                        Update
                                    </Button>
                                    <span>{currency.name}</span>
                                </div>
                            </ProgressAccordion.Header>
                            <ProgressAccordion.Content className="flex flex-col gap-y-2 pb-2">
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Date</Table.HeaderCell>
                                            <Table.HeaderCell>Code</Table.HeaderCell>
                                            <Table.HeaderCell>Exchange Rate</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {findMissingExchangeRates(currency, store.currencies).map((mc) => (
                                            <Table.Row className="bg-rose-500">
                                                <Table.Cell>
                                                    ??
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {mc}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    ??
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        {currency.exchange_rates && currency.exchange_rates.map((er) => (
                                            <Table.Row>
                                                <Table.Cell className={`${(new Date(er.timestamp).getTime() + (12 * 60 * 60 * 1000)) < Date.now() && 'bg-rose-300'}`}>
                                                    {new Date(er.timestamp).toLocaleString()}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {er.secondary_currency.code}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {er.exchange_rate}
                                                </Table.Cell>
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