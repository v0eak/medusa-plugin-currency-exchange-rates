export declare module "@medusajs/medusa/dist/models/currency" {
    declare interface Currency {
        rates: Record<string, number> | null;
        rates_timestamp: Date | null;
    }
}