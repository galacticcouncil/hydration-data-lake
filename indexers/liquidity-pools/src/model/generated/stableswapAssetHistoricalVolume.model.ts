import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StableswapHistoricalVolume} from "./stableswapHistoricalVolume.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"

@Entity_()
export class StableswapAssetHistoricalVolume {
  constructor(props?: Partial<StableswapAssetHistoricalVolume>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<assetId>-<paraChainBlockHeight> (e.g. 100-10-101332)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => StableswapHistoricalVolume, {nullable: true})
  volumesCollection!: StableswapHistoricalVolume

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapTotalFees!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapTotalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapTotalVolumeOut!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
