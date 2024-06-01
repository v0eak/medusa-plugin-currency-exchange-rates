import { useEffect, useState } from "react"
import { Currency, Store } from "@medusajs/medusa"
import { RouteConfig, RouteProps } from "@medusajs/admin"
import { useAdminCustomQuery, useAdminStore } from "medusa-react"
import { Container, Heading, ProgressAccordion, Badge, Button, Table } from "@medusajs/ui"
import { CurrencyDollar } from "@medusajs/icons"
import { initializeNotify, useCreateCurrencyRates } from "../../lib/data"

const processAllCurrencyRates = async (currencies, createCurrencyRates) => {
    const promises = currencies.map(currency => createCurrencyRates(currency.code));

    const results = await Promise.allSettled(promises)
    const rejectedResults = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    rejectedResults.forEach(result => {
        console.error(`Failed to process currency rates: `, result.reason);
    })
};

const ExchangeRatepage = ({notify}: RouteProps) => {
    const {
        store,
        isLoading
    } = useAdminStore()
    const [currencyIndex, setCurrencyIndex] = useState(0);
    const [fetchInProgress, setFetchInProgress] = useState(false);

    const currencyData = store.currencies[currencyIndex];
    const createCurrencyRates = useCreateCurrencyRates(currencyData?.code);

    const handleCreateCurrencyRates = async (currencyCode) => {
        const symbols = store.currencies.filter(c => c.code !== currencyCode).map(c => c.code);
        try {
            await createCurrencyRates(symbols);
        } catch (error) {
            console.error(`Failed to create currency rates for ${currencyCode}:`, error);
            // Handle the error if needed
        }
    };

    useEffect(() => {
        if (currencyIndex < store.currencies.length && !fetchInProgress) {
            const fetchData = async () => {
                setFetchInProgress(true);
                await handleCreateCurrencyRates(store.currencies[currencyIndex].code);
                setCurrencyIndex(prevIndex => prevIndex + 1);
                setFetchInProgress(false);
            };

            fetchData().catch(console.error);
        }
    }, [currencyIndex, fetchInProgress, store.currencies]);

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
                                onClick={() => setCurrencyIndex(0)}
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
                                <div className="flex items-center gap-x-2">
                                    <Button
                                        size="small"
                                        variant={currency.exchange_rates.some((er) => (new Date(er.timestamp).getTime() + (12 * 60 * 60 * 1000)) < Date.now()) ? "danger" : "secondary"}
                                        onClick={() => handleCreateCurrencyRates(currency.code)}
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
                                        {currency.exchange_rates.map((er) => (
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Badge size="xsmall">
                                                        {new Date(er.timestamp).toLocaleString()}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge size="xsmall">
                                                        {er.secondary_currency.code}
                                                    </Badge>
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