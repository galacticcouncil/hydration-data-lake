import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {StablepoolHistoricalVolume} from "./stablepoolHistoricalVolume.model"
import {Asset} from "./asset.model"

@Entity_()
export class StablepoolAssetHistoricalVolume {
    constructor(props?: Partial<StablepoolAssetHistoricalVolume>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => StablepoolHistoricalVolume, {nullable: true})
    volumesCollection!: StablepoolHistoricalVolume

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    swapFee!: bigint

    @BigIntColumn_({nullable: false})
    swapTotalFees!: bigint

    @BigIntColumn_({nullable: false})
    liqFee!: bigint

    @BigIntColumn_({nullable: false})
    liqTotalFees!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqFee!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqTotalFees!: bigint

    @BigIntColumn_({nullable: false})
    swapVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    swapVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    swapTotalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    swapTotalVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    liqAddedAmount!: bigint

    @BigIntColumn_({nullable: false})
    liqRemovedAmount!: bigint

    @BigIntColumn_({nullable: false})
    liqAddedTotalAmount!: bigint

    @BigIntColumn_({nullable: false})
    liqRemovedTotalAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqAddedAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqRemovedAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqAddedTotalAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqRemovedTotalAmount!: bigint

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
