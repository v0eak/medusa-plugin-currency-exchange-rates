export default async function () {
    const storeProductImports = (await import(
        "@medusajs/medusa/dist/api/routes/store/products/index"
    )) as any

    const adminProductImports = (await import(
        '@medusajs/medusa/dist/api/routes/admin/products/index'
    )) as any;

    adminProductImports.defaultAdminProductRelations = [
        ...adminProductImports.defaultAdminProductRelations,
        'variants.prices.currency',
        'variants.prices.currency.exchange_rates'
    ];

    storeProductImports.defaultStoreProductsRelations = [
        ...storeProductImports.defaultStoreProductsRelations,
        'variants.prices.currency',
        'variants.prices.currency.exchange_rates'
    ]

    storeProductImports.allowedStoreProductsRelations = [
        ...storeProductImports.allowedStoreProductsRelations,
        'variants.prices.currency',
        'variants.prices.currency.exchange_rates'
    ]
}