import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { MoneyMarketReserve } from './moneyMarketReserve.model';

@Entity_()
export class MmReserveIndexesHistoricalData {
  constructor(props?: Partial<MmReserveIndexesHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <underlying_asset_address>-<para_block_height>
   */
  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => MoneyMarketReserve, { nullable: true })
  reserve!: MoneyMarketReserve;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  liquidityRate!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  variableBorrowRate!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  liquidityIndex!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  variableBorrowIndex!: bigint | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
