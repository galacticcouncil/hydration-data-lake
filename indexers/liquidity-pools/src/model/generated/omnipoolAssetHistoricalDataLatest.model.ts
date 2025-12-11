import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class OmnipoolAssetHistoricalDataLatest {
    constructor(props?: Partial<OmnipoolAssetHistoricalDataLatest>) {
        Object.assign(this, props)
    }

    /**
     * <omnipoolAssetId>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    poolHistoricalDataId!: string

    @StringColumn_({nullable: false})
    omnipoolAssetId!: string

    @Index_()
    @StringColumn_({nullable: false})
    assetId!: string

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

    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: false})
    blockId!: string
}
