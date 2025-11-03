import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class StableswapAssetHistoricalDataLatest {
  constructor(props?: Partial<StableswapAssetHistoricalDataLatest>) {
    Object.assign(this, props)
  }

  /**
   * <stablepoolId>-<assetId>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("text", {nullable: false})
  poolId!: string

  @Column_("text", {nullable: false})
  stableswapAssetId!: string

  @Column_("text", {nullable: false})
  poolHistoricalDataId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  freeBalance!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
