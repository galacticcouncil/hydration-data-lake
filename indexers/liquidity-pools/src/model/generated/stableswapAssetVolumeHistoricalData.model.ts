import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {StableswapVolumeHistoricalData} from "./stableswapVolumeHistoricalData.model"

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

    @StringColumn_({nullable: false})
    assetId!: string

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

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
