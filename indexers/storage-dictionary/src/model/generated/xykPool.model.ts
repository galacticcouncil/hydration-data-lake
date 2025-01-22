import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {XykPoolAssetsData} from "./xykPoolAssetsData.model"

@Entity_()
export class XykPool {
  constructor(props?: Partial<XykPool>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  /**
   * XYK pool address
   */
  @Index_()
  @Column_("text", {nullable: false})
  poolAddress!: string

  @Index_()
  @Column_("int4", {nullable: false})
  assetAId!: number

  @Index_()
  @Column_("int4", {nullable: false})
  assetBId!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @OneToMany_(() => XykPoolAssetsData, e => e.pool)
  assets!: XykPoolAssetsData[]
}
