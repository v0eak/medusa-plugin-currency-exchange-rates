import { Entity, PrimaryColumn, Column } from "typeorm";
import { Currency as MedusaCurrency } from "@medusajs/medusa"

@Entity()
export class Currency extends MedusaCurrency {
    @Column({ type: 'jsonb', nullable: true})
        rates: Record<string, number> | null;

    @Column({ type: 'timestamp', nullable: true})
        rates_timestamp: Date | null;
}