import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';

@Entity_()
export class AccountAssetBalanceHistoricalData {
  constructor(props?: Partial<AccountAssetBalanceHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <address>-<assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  accountId!: string;

  @Column_('text', { nullable: false })
  assetId!: string;

  /**
   * free property in storage
   */
  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  transferable!: bigint;

  /**
   * reserved property in storage
   */
  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalLocked!: bigint;

  @Column_('text', { nullable: true })
  transferableInRefAssetNorm!: string | undefined | null;

  @Column_('text', { nullable: true })
  totalLockedInRefAssetNorm!: string | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
