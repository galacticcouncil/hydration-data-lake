import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class OmnipoolAssetHistoricalVolume {
    constructor(props?: Partial<OmnipoolAssetHistoricalVolume>) {
        Object.assign(this, props)
    }

    /**
     * OmnipoolAssetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @BigIntColumn_({nullable: false})
    assetVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    assetVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    assetFee!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalFees!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
