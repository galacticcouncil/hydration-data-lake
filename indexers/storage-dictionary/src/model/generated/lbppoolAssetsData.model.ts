import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Lbppool} from "./lbppool.model"
import {MinifiedDataStructure} from "./_minifiedDataStructure"

@Entity_()
export class LbppoolAssetsData {
  constructor(props?: Partial<LbppoolAssetsData>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Lbppool, {nullable: true})
  pool!: Lbppool

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
