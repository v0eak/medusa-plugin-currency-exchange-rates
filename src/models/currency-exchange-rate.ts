import { Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity, Currency as MedusaCurrency, generateEntityId } from "@medusajs/medusa"
import { Currency } from "./currency";

@Entity()
export class CurrencyExchangeRate extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: string

    @ManyToOne(() => Currency, currency => currency.primary_exchange_rates)
        @JoinColumn({ name: "primary_currency_id" })
        primary_currency: Currency

    @ManyToOne(() => Currency, currency => currency.secondary_exchange_rates)
        @JoinColumn({ name: "primary_currency_id" })
        secondary_currency: Currency

    @Column('numeric')
        exchange_rate: number;

    @Column({ type: 'timestamp', nullable: true})
        timestamp: Date | null;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "cer")
    }
}