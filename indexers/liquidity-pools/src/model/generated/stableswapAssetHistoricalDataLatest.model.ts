import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
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

  @Column_("int4", {nullable: true})
  tradable!: number | undefined | null

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
