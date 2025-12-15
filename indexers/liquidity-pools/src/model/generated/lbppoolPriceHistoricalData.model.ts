import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Lbppool} from "./lbppool.model"

@Entity_()
export class LbppoolPriceHistoricalData {
  constructor(props?: Partial<LbppoolPriceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <lbppoolId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Lbppool, {nullable: true})
  pool!: Lbppool

  @Column_("text", {nullable: false})
  assetAId!: string

  @Column_("text", {nullable: false})
  assetBId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetABalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBBalance!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
