import { Entity, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '@modules/common';

@Entity()
export class TrackedEntity extends BaseEntity {
  @CreateDateColumn() created!: Date;
  @UpdateDateColumn() updated?: Date;
}
