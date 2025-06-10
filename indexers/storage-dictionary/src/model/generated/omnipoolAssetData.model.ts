import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Omnipool} from "./omnipool.model"
import {MinifiedDataStructure} from "./_minifiedDataStructure"

@Entity_()
export class OmnipoolAssetData {
  constructor(props?: Partial<OmnipoolAssetData>) {
    Object.assign(this, props)
  }

  /**
   * omnipooAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  pool!: Omnipool

  @Column_("int4", {nullable: false})
  assetId!: number

  /**
   * AccountBalances
   */
  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new MinifiedDataStructure(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: MinifiedDataStructure

  /**
   * OmnipoolAssetState
   */
  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new MinifiedDataStructure(undefined, marshal.nonNull(obj))}, nullable: false})
  assetState!: MinifiedDataStructure

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
