import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {OmnipoolHistoricalData} from "./omnipoolHistoricalData.model"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {Asset} from "./asset.model"

@Entity_()
export class OmnipoolAssetHistoricalData {
    constructor(props?: Partial<OmnipoolAssetHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <omnipoolAssetId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-0-101312)
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolHistoricalData, {nullable: true})
    poolHistoricalData!: OmnipoolHistoricalData

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    assetCap!: bigint

    @BigIntColumn_({nullable: false})
    assetShares!: bigint

    @BigIntColumn_({nullable: false})
    assetHubReserve!: bigint

    @BigIntColumn_({nullable: false})
    assetProtocolShares!: bigint

    @BigIntColumn_({nullable: false})
    freeBalance!: bigint

    @IntColumn_({nullable: false})
    tradable!: number

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
