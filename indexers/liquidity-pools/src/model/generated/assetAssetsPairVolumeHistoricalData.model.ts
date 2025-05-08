import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {AssetHistoricalData} from "./assetHistoricalData.model"
import {AssetsPairVolumeHistoricalData} from "./assetsPairVolumeHistoricalData.model"

@Entity_()
export class AssetAssetsPairVolumeHistoricalData {
  constructor(props?: Partial<AssetAssetsPairVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => AssetHistoricalData, {nullable: true})
  assetHistoricalData!: AssetHistoricalData

  @Index_()
  @ManyToOne_(() => AssetsPairVolumeHistoricalData, {nullable: true})
  assetsPairVolumeHistoricalData!: AssetsPairVolumeHistoricalData
}
