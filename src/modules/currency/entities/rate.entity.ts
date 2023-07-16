import { Entity, Column, ManyToMany, JoinColumn, OneToMany } from 'typeorm';
import { TrackedEntity } from '@modules/common';
import { Currency } from '@modules/currency/entities/currency.entity';
import { Offer } from '@modules/offer/entities/offer.entity';

@Entity()
export class Rate extends TrackedEntity {
  @Column()
  ratePrice: number;

  @Column()
  markupRatePrice: number;

  @Column({ type: 'uuid' })
  sourceId: string;

  @Column({ type: 'uuid' })
  targetId: string;

  @ManyToMany((type) => Currency, (currency) => currency.rates)
  @JoinColumn({ name: 'sourceId', referencedColumnName: 'id' })
  source: Currency;

  @ManyToMany((type) => Currency, (currency) => currency.rates)
  @JoinColumn({ name: 'targetId', referencedColumnName: 'id' })
  target: Currency;

  @OneToMany((type) => Offer, (offer) => offer.rate)
  offers: Offer[];
}
