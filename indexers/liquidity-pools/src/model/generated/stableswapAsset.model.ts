import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Stableswap} from "./stableswap.model"

@Entity_()
export class StableswapAsset {
  constructor(props?: Partial<StableswapAsset>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<assetId> (e.g. 101-19)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  pool!: Stableswap

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint
}
