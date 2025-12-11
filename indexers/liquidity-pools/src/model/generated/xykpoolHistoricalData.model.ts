import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Xykpool} from "./xykpool.model"

@Entity_()
export class XykpoolHistoricalData {
    constructor(props?: Partial<XykpoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * poolAddress-assetId-paraBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Xykpool, {nullable: true})
    pool!: Xykpool

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
