import { Entity, PrimaryColumn, Column, OneToMany, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseEntity, Currency as MedusaCurrency, generateEntityId } from "@medusajs/medusa"
import { Currency } from "./currency";

@Entity()
@Unique(["base_currency", "secondary_currency"])
export class CurrencyExchangeRate extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: string

    @ManyToOne(() => Currency, currency => currency.code)
        @JoinColumn({ name: "base_currency_id" })
        base_currency: Currency

    @ManyToOne(() => Currency, currency => currency.code)
        @JoinColumn({ name: "secondary_currency_id" })
        secondary_currency: Currency

    @Column('numeric')
        exchange_rate: number;

    @Column({ type: 'timestamp'})
        timestamp: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "cer")
    }
}