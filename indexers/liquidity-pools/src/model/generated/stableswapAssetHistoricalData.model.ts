import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
import {StableswapAsset} from "./stableswapAsset.model"
import {StableswapHistoricalData} from "./stableswapHistoricalData.model"

@Entity_()
export class StableswapAssetHistoricalData {
    constructor(props?: Partial<StableswapAssetHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <stablepoolId>-<assetId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Index_()
    @ManyToOne_(() => StableswapAsset, {nullable: true})
    stableswapAsset!: StableswapAsset

    @Index_()
    @ManyToOne_(() => StableswapHistoricalData, {nullable: true})
    poolHistoricalData!: StableswapHistoricalData

    @BigIntColumn_({nullable: false})
    freeBalance!: bigint

    @IntColumn_({nullable: true})
    tradable!: number | undefined | null

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
