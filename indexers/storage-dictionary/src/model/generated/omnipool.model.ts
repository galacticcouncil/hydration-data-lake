import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Tradability} from "./_tradability"
import {OmnipoolAssetData} from "./omnipoolAssetData.model"

@Entity_()
export class Omnipool {
  constructor(props?: Partial<Omnipool>) {
    Object.assign(this, props)
  }

  /**
   * omnipoolId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  poolAddress!: string

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new Tradability(undefined, marshal.nonNull(obj))}, nullable: false})
  hubAssetTradability!: Tradability

  @OneToMany_(() => OmnipoolAssetData, e => e.pool)
  assets!: OmnipoolAssetData[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
