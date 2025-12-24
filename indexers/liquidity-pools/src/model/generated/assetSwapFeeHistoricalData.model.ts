import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';

@Entity_()
export class AssetSwapFeeHistoricalData {
  constructor(props?: Partial<AssetSwapFeeHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  assetId!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  amount!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalAmount!: bigint;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
