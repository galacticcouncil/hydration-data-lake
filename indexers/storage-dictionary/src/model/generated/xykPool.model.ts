import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {XykpoolAssetsData} from "./xykpoolAssetsData.model"

@Entity_()
export class Xykpool {
  constructor(props?: Partial<Xykpool>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-paraBlockHeight
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

  @Column_("text", {nullable: true})
  shareTokenId!: string | undefined | null

  @OneToMany_(() => XykpoolAssetsData, e => e.pool)
  assets!: XykpoolAssetsData[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
