import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { DynamicFeesAssetFeeParameters } from './_dynamicFeesAssetFeeParameters';

@Entity_()
export class ConstantsHistoricalData {
  constructor(props?: Partial<ConstantsHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('int4', { array: true, nullable: true })
  lbpRepayFee!: number[] | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  lbpMaxInRatio!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  lbpMaxOutRatio!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  lbpMinPoolLiquidity!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  lbpMinTradingLimit!: bigint | undefined | null;

  @Column_('int4', { nullable: true })
  omnipoolBurnProtocolFee!: number | undefined | null;

  @Column_('int4', { nullable: true })
  omnipoolHdxAssetId!: number | undefined | null;

  @Column_('int4', { nullable: true })
  omnipoolHubAssetId!: number | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  omnipoolMaxInRatio!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  omnipoolMaxOutRatio!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  omnipoolMinimumPoolLiquidity!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  omnipoolMinimumTradingLimit!: bigint | undefined | null;

  @Column_('int4', { nullable: true })
  omnipoolMinWithdrawalFee!: number | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  stableswapMinTradingLimit!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  stableswapMinPoolLiquidity!: bigint | undefined | null;

  @Column_('int4', { array: true, nullable: true })
  stableswapAmplificationRange!: number[] | undefined | null;

  @Column_('int4', { array: true, nullable: true })
  xykGetExchangeFee!: number[] | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  xykMaxInRatio!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  xykMaxOutRatio!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  xykMinPoolLiquidity!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  xykMinTradingLimit!: bigint | undefined | null;

  @Column_('int4', { nullable: true })
  xykNativeAssetId!: number | undefined | null;

  @Column_('text', { nullable: true })
  xykOracleSource!: string | undefined | null;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => (obj == null ? undefined : obj.toJSON()),
      from: (obj) =>
        obj == null
          ? undefined
          : new DynamicFeesAssetFeeParameters(undefined, obj),
    },
    nullable: true,
  })
  dynamicFeesAssetFeeParameters!:
    | DynamicFeesAssetFeeParameters
    | undefined
    | null;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => (obj == null ? undefined : obj.toJSON()),
      from: (obj) =>
        obj == null
          ? undefined
          : new DynamicFeesAssetFeeParameters(undefined, obj),
    },
    nullable: true,
  })
  dynamicFeesProtocolFeeParameters!:
    | DynamicFeesAssetFeeParameters
    | undefined
    | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
