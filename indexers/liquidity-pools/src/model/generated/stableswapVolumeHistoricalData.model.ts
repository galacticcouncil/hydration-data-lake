import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetVolumeHistoricalData} from "./stableswapAssetVolumeHistoricalData.model"

@Entity_()
export class StableswapVolumeHistoricalData {
    constructor(props?: Partial<StableswapVolumeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <stableswapId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stableswap, {nullable: true})
    pool!: Stableswap

    @OneToMany_(() => StableswapAssetVolumeHistoricalData, e => e.volumesCollection)
    assetVolumes!: StableswapAssetVolumeHistoricalData[]

    @StringColumn_({nullable: false})
    poolVolInNorm!: string

    @StringColumn_({nullable: false})
    poolVolOutNorm!: string

    @StringColumn_({nullable: false})
    poolFeesVolNorm!: string

    @StringColumn_({nullable: false})
    poolTotalVolInNorm!: string

    @StringColumn_({nullable: false})
    poolTotalVolOutNorm!: string

    @StringColumn_({nullable: false})
    poolTotalFeesVolNorm!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
