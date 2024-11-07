import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"

@Entity_()
export class HistoricalAssetVolume {
    constructor(props?: Partial<HistoricalAssetVolume>) {
        Object.assign(this, props)
    }

    /**
     * AssetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    volumeIn!: bigint

    @BigIntColumn_({nullable: false})
    volumeOut!: bigint

    @BigIntColumn_({nullable: false})
    totalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    totalVolumeOut!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
