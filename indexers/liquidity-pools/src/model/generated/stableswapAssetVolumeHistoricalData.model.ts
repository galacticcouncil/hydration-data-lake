import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {StableswapVolumeHistoricalData} from "./stableswapVolumeHistoricalData.model"
import {Asset} from "./asset.model"

@Entity_()
export class StableswapAssetVolumeHistoricalData {
    constructor(props?: Partial<StableswapAssetVolumeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <stableswapId>-<assetId>-<paraBlockHeight> (e.g. 100-10-101332)
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => StableswapVolumeHistoricalData, {nullable: true})
    volumesCollection!: StableswapVolumeHistoricalData

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    assetFeeVol!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalFeesVol!: bigint

    @BigIntColumn_({nullable: false})
    assetVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolOut!: bigint

    @StringColumn_({nullable: false})
    assetVolInNorm!: string

    @StringColumn_({nullable: false})
    assetVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetFeeVolNorm!: string

    @StringColumn_({nullable: false})
    assetTotalVolInNorm!: string

    @StringColumn_({nullable: false})
    assetTotalVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetTotalFeesVolNorm!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
