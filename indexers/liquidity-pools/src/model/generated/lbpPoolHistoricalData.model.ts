import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {LbpPool} from "./lbpPool.model"
import {Asset} from "./asset.model"
import {Account} from "./account.model"

@Entity_()
export class LbpPoolHistoricalData {
    constructor(props?: Partial<LbpPoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * poolAddress-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LbpPool, {nullable: true})
    pool!: LbpPool

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetA!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetB!: Asset

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @IntColumn_({nullable: true})
    start!: number | undefined | null

    @IntColumn_({nullable: true})
    end!: number | undefined | null

    @IntColumn_({nullable: false})
    initialWeight!: number

    @IntColumn_({nullable: false})
    finalWeight!: number

    @StringColumn_({nullable: false})
    weightCurve!: string

    @IntColumn_({array: true, nullable: false})
    fee!: (number)[]

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    feeCollector!: Account | undefined | null

    @BigIntColumn_({nullable: false})
    repayTarget!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
