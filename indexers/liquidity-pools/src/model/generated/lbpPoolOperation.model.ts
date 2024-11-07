import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {LbpPool} from "./lbpPool.model"
import {PoolOperationType} from "./_poolOperationType"

@Entity_()
export class LbpPoolOperation {
    constructor(props?: Partial<LbpPoolOperation>) {
        Object.assign(this, props)
    }

    /**
     * TxId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    indexInBlock!: number

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetIn!: Asset

    @BigIntColumn_({nullable: false})
    assetInAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetInFee!: bigint

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetOut!: Asset

    @BigIntColumn_({nullable: false})
    assetOutAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetOutFee!: bigint

    @FloatColumn_({nullable: false})
    swapPrice!: number

    @Index_()
    @ManyToOne_(() => LbpPool, {nullable: true})
    pool!: LbpPool

    @Column_("varchar", {length: 4, nullable: false})
    type!: PoolOperationType

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
