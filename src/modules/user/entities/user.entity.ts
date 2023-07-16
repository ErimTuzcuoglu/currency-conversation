import { Entity, Column, OneToMany, Relation } from 'typeorm';
import type { Wallet } from '@modules/user/entities/wallet.entity';
import { Offer } from '@modules/offer/entities/offer.entity';
import { TrackedEntity } from '@modules/common';

@Entity()
export class User extends TrackedEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  hashedPassword: string;

  @Column()
  salt: string;

  @Column()
  refreshToken: string;

  @OneToMany('Wallet', 'user')
  wallets: Relation<Wallet[]>;

  @OneToMany((type) => Offer, (offer) => offer.user)
  offers: Offer[];
}
