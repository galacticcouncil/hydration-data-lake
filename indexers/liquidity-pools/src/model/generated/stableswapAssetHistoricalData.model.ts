import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StableswapAsset} from "./stableswapAsset.model"

@Entity_()
export class StableswapAssetHistoricalData {
  constructor(props?: Partial<StableswapAssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <stablepoolId>-<assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  assetId!: string

  @Index_()
  @ManyToOne_(() => StableswapAsset, {nullable: true})
  stableswapAsset!: StableswapAsset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  freeBalance!: bigint

  @Column_("int4", {nullable: true})
  tradable!: number | undefined | null

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
