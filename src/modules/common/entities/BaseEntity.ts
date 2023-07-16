import { Entity, Column, DeleteDateColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @Column({ primary: true, generated: 'uuid', type: 'uuid' })
  id!: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
