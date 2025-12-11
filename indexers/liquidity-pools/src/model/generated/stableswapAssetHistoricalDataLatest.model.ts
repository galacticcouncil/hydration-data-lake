import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class StableswapAssetHistoricalDataLatest {
    constructor(props?: Partial<StableswapAssetHistoricalDataLatest>) {
        Object.assign(this, props)
    }

    /**
     * <stablepoolId>-<assetId>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    assetId!: string

    @StringColumn_({nullable: false})
    poolId!: string

    @StringColumn_({nullable: false})
    stableswapAssetId!: string

    @StringColumn_({nullable: false})
    poolHistoricalDataId!: string

    @BigIntColumn_({nullable: false})
    freeBalance!: bigint

    @IntColumn_({nullable: true})
    tradable!: number | undefined | null

    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: false})
    blockId!: string
}
