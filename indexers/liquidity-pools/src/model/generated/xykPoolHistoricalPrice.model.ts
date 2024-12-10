import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {XykPool} from "./xykPool.model"
import {Asset} from "./asset.model"

@Entity_()
export class XykPoolHistoricalPrice {
  constructor(props?: Partial<XykPoolHistoricalPrice>) {
    Object.assign(this, props)
  }

  /**
   * PoolId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => XykPool, {nullable: true})
  pool!: XykPool

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetA!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetB!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetABalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBBalance!: bigint

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
