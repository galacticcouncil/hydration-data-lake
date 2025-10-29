import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class OmnipoolAssetVolumeHistoricalData {
    constructor(props?: Partial<OmnipoolAssetVolumeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <omnipoolAssetId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-0-101312)
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @BigIntColumn_({nullable: false})
    assetVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetFeeVol!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalFeesVol!: bigint

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
