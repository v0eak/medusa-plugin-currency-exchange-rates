export default async function () {
    const adminStoreImports = (await import(
        '@medusajs/medusa/dist/api/routes/admin/store/index'
    )) as any;

    adminStoreImports.defaultRelationsExtended = [
        ...adminStoreImports.defaultRelationsExtended,
        'currencies.exchange_rates'
    ];

    adminStoreImports.defaultRelationsExtended = [
        ...adminStoreImports.defaultRelationsExtended,
        'currencies.exchange_rates.secondary_currency'
    ];
}