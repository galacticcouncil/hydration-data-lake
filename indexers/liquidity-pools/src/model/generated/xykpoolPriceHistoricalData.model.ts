import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Xykpool} from "./xykpool.model"

@Entity_()
export class XykpoolPriceHistoricalData {
  constructor(props?: Partial<XykpoolPriceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * PoolId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  pool!: Xykpool

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

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
