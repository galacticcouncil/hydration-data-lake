import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {AssetHistoricalData} from "./assetHistoricalData.model"
import {AssetsPairVolumeHistoricalData} from "./assetsPairVolumeHistoricalData.model"

@Entity_()
export class AssetAssetsPairVolume {
    constructor(props?: Partial<AssetAssetsPairVolume>) {
        Object.assign(this, props)
    }

    /**
     * <assetHistoricalDataId>-<assetsPairVolumeHistoricalData>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => AssetHistoricalData, {nullable: true})
    assetHistoricalData!: AssetHistoricalData

    @Index_()
    @ManyToOne_(() => AssetsPairVolumeHistoricalData, {nullable: true})
    assetsPairVolumeHistoricalData!: AssetsPairVolumeHistoricalData

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
