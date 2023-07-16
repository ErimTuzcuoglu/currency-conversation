import { Entity, Column, ManyToMany, OneToMany, Relation } from 'typeorm';
import { TrackedEntity } from '@modules/common';
import { Wallet } from '@modules/user/entities/wallet.entity';
import { Rate } from './rate.entity';

@Entity()
export class Currency extends TrackedEntity {
  @Column()
  name: string;

  @Column()
  currencyCode: string;

  @ManyToMany('Rate', 'id')
  rates: Relation<Rate[]>;

  @OneToMany((type) => Wallet, (wallet) => wallet.id)
  wallets: Wallet[];
}
