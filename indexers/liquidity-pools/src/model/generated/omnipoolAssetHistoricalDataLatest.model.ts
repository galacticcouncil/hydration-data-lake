import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OmnipoolAssetHistoricalDataLatest {
  constructor(props?: Partial<OmnipoolAssetHistoricalDataLatest>) {
    Object.assign(this, props)
  }

  /**
   * <omnipoolAssetId>
   */
  @PrimaryColumn_()
  id!: string

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

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
