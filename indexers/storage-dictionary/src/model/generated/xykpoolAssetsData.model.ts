import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Xykpool} from "./xykpool.model"
import {MinifiedDataStructure} from "./_minifiedDataStructure"

@Entity_()
export class XykpoolAssetsData {
  constructor(props?: Partial<XykpoolAssetsData>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  pool!: Xykpool

  @Column_("int4", {nullable: false})
  assetId!: number

  /**
   * AccountBalances
   */
  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new MinifiedDataStructure(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: MinifiedDataStructure

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
