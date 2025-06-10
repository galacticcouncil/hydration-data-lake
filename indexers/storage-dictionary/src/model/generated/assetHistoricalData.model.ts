import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {MinifiedDataStructure} from "./_minifiedDataStructure"

@Entity_()
export class AssetHistoricalData {
  constructor(props?: Partial<AssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("text", {nullable: false})
  totalIssuance!: string

  /**
   * AssetDynamicFee
   */
  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new MinifiedDataStructure(undefined, obj)}, nullable: true})
  dynamicFee!: MinifiedDataStructure | undefined | null

  @Column_("text", {nullable: false})
  existentialDeposit!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
