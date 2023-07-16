import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@modules/common';
import { Rate } from '@modules/currency/entities/rate.entity';
import { User } from '@modules/user/entities/user.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  price: number;

  @Column()
  validUntil: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ type: 'uuid' })
  rateId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne((type) => Rate, (rate) => rate.offers)
  @JoinColumn({ name: 'rateId', referencedColumnName: 'id' })
  rate: Rate;

  @OneToOne((type) => User, (user) => user.offers)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
