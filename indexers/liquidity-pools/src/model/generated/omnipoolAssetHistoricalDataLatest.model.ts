import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OmnipoolAssetHistoricalDataLatest {
  constructor(props?: Partial<OmnipoolAssetHistoricalDataLatest>) {
    Object.assign(this, props)
  }

  /**
   * <omnipoolAssetId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-0-101312)
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  poolHistoricalDataId!: string

  @Column_("text", {nullable: false})
  omnipoolAssetId!: string

  @Index_()
  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetCap!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetHubReserve!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetProtocolShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  freeBalance!: bigint

  @Column_("int4", {nullable: false})
  tradable!: number

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
