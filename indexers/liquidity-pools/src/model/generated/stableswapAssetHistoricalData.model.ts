import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {StableswapAsset} from "./stableswapAsset.model"
import {StableswapHistoricalData} from "./stableswapHistoricalData.model"
import {Block} from "./block.model"

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

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Index_()
  @ManyToOne_(() => StableswapAsset, {nullable: true})
  stableswapAsset!: StableswapAsset

  @Index_()
  @ManyToOne_(() => StableswapHistoricalData, {nullable: true})
  poolHistoricalData!: StableswapHistoricalData

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  freeBalance!: bigint

  @Column_("int4", {nullable: true})
  tradable!: number | undefined | null

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
