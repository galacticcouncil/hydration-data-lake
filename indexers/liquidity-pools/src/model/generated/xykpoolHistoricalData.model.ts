import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Xykpool} from "./xykpool.model"
import {Asset} from "./asset.model"

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

    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
