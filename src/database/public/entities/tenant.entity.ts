import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Tenant extends BaseEntity {
  @Column()
  name: string;
}
