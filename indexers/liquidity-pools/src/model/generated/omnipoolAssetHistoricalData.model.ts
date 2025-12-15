import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolHistoricalData} from "./omnipoolHistoricalData.model"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class OmnipoolAssetHistoricalData {
  constructor(props?: Partial<OmnipoolAssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <omnipoolAssetId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-0-101312)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolHistoricalData, {nullable: true})
  poolHistoricalData!: OmnipoolHistoricalData

  @Index_()
  @ManyToOne_(() => OmnipoolAsset, {nullable: true})
  omnipoolAsset!: OmnipoolAsset

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

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
