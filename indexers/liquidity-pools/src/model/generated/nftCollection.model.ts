import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
} from 'typeorm';
import * as marshal from './marshal';

@Entity_()
export class NftCollection {
  constructor(props?: Partial<NftCollection>) {
    Object.assign(this, props);
  }

  /**
   * collection ID
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  collectionType!: string;

  @Column_('text', { nullable: false })
  ownerId!: string;

  @Column_('text', { nullable: false })
  issuerId!: string;

  @Column_('text', { nullable: false })
  adminId!: string;

  @Column_('text', { nullable: false })
  freezerId!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalDeposit!: bigint;

  @Column_('bool', { nullable: false })
  freeHolding!: boolean;

  @Column_('bool', { nullable: false })
  isFrozen!: boolean;

  @Column_('int4', { nullable: false })
  items!: number;

  @Column_('int4', { nullable: false })
  itemMetadatas!: number;

  @Column_('int4', { nullable: false })
  attributes!: number;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  maxSupply!: bigint | undefined | null;
}
