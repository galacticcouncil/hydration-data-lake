import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Lbppool} from "./lbppool.model"

@Entity_()
export class LbppoolHistoricalData {
    constructor(props?: Partial<LbppoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * poolAddress-assetId-paraBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Lbppool, {nullable: true})
    pool!: Lbppool

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @StringColumn_({nullable: false})
    ownerId!: string

    @StringColumn_({nullable: true})
    feeCollectorId!: string | undefined | null

    @IntColumn_({nullable: true})
    startBlockNumber!: number | undefined | null

    @IntColumn_({nullable: true})
    endBlockNumber!: number | undefined | null

    @IntColumn_({nullable: false})
    initialWeight!: number

    @IntColumn_({nullable: false})
    finalWeight!: number

    @BigIntColumn_({nullable: false})
    repayTarget!: bigint

    @StringColumn_({nullable: false})
    weightCurve!: string

    @IntColumn_({array: true, nullable: false})
    fee!: (number)[]

    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
