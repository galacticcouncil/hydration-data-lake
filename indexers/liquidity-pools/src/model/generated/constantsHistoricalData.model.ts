import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {DynamicFeesAssetFeeParameters} from "./_dynamicFeesAssetFeeParameters"

@Entity_()
export class ConstantsHistoricalData {
    constructor(props?: Partial<ConstantsHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @IntColumn_({array: true, nullable: true})
    lbpRepayFee!: (number)[] | undefined | null

    @BigIntColumn_({nullable: true})
    lbpMaxInRatio!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    lbpMaxOutRatio!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    lbpMinPoolLiquidity!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    lbpMinTradingLimit!: bigint | undefined | null

    @IntColumn_({nullable: true})
    omnipoolBurnProtocolFee!: number | undefined | null

    @IntColumn_({nullable: true})
    omnipoolHdxAssetId!: number | undefined | null

    @IntColumn_({nullable: true})
    omnipoolHubAssetId!: number | undefined | null

    @BigIntColumn_({nullable: true})
    omnipoolMaxInRatio!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    omnipoolMaxOutRatio!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    omnipoolMinimumPoolLiquidity!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    omnipoolMinimumTradingLimit!: bigint | undefined | null

    @IntColumn_({nullable: true})
    omnipoolMinWithdrawalFee!: number | undefined | null

    @BigIntColumn_({nullable: true})
    stableswapMinTradingLimit!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    stableswapMinPoolLiquidity!: bigint | undefined | null

    @IntColumn_({array: true, nullable: true})
    stableswapAmplificationRange!: (number)[] | undefined | null

    @IntColumn_({array: true, nullable: true})
    xykGetExchangeFee!: (number)[] | undefined | null

    @BigIntColumn_({nullable: true})
    xykMaxInRatio!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    xykMaxOutRatio!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    xykMinPoolLiquidity!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    xykMinTradingLimit!: bigint | undefined | null

    @IntColumn_({nullable: true})
    xykNativeAssetId!: number | undefined | null

    @StringColumn_({nullable: true})
    xykOracleSource!: string | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DynamicFeesAssetFeeParameters(undefined, obj)}, nullable: true})
    dynamicFeesAssetFeeParameters!: DynamicFeesAssetFeeParameters | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DynamicFeesAssetFeeParameters(undefined, obj)}, nullable: true})
    dynamicFeesProtocolFeeParameters!: DynamicFeesAssetFeeParameters | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
