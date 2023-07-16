import { Entity, Column, ManyToOne, OneToOne, Relation } from 'typeorm';
import { BaseEntity } from '@modules/common';
import type { User } from '@modules/user/entities/user.entity';
import { Currency } from '@modules/currency/entities/currency.entity';

@Entity()
export class Wallet extends BaseEntity {
  @Column()
  balance: number;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  currencyId: string;

  @Column()
  test: string;

  @ManyToOne('User', 'wallets')
  user: Relation<User>;

  @OneToOne((type) => Currency, (currency) => currency.id)
  currency: Currency;
}
