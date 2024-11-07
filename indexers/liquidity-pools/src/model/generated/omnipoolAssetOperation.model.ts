import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {Account} from "./account.model"
import {PoolOperationType} from "./_poolOperationType"

@Entity_()
export class OmnipoolAssetOperation {
    constructor(props?: Partial<OmnipoolAssetOperation>) {
        Object.assign(this, props)
    }

    /**
     * TxId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    assetIn!: OmnipoolAsset

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    assetOut!: OmnipoolAsset

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    indexInBlock!: number

    @BigIntColumn_({nullable: false})
    assetInAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetOutAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetFeeAmount!: bigint

    @BigIntColumn_({nullable: false})
    protocolFeeAmount!: bigint

    @BigIntColumn_({nullable: false})
    hubAmountIn!: bigint

    @BigIntColumn_({nullable: false})
    hubAmountOut!: bigint

    @Column_("varchar", {length: 4, nullable: false})
    type!: PoolOperationType

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
