import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {StableswapHistoricalData} from "./stableswapHistoricalData.model"
import {Block} from "./block.model"

@Entity_()
export class StableswapAssetHistoricalData {
  constructor(props?: Partial<StableswapAssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <stablepoolId>-<assetId>-<paraChainBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Index_()
  @ManyToOne_(() => StableswapHistoricalData, {nullable: true})
  poolHistoricalData!: StableswapHistoricalData

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  freeBalance!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
