import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.enity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;
}
