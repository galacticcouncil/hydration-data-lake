import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {Stablepool} from "./stablepool.model"
import {PoolOperationType} from "./_poolOperationType"

@Entity_()
export class StablepoolOperation {
    constructor(props?: Partial<StablepoolOperation>) {
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
    @ManyToOne_(() => Asset, {nullable: true})
    assetIn!: Asset

    @BigIntColumn_({nullable: false})
    assetInAmount!: bigint

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetOut!: Asset

    @BigIntColumn_({nullable: false})
    assetOutAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetFeeAmount!: bigint

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @Column_("varchar", {length: 4, nullable: false})
    type!: PoolOperationType

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    indexInBlock!: number

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
