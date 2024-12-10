import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {Asset} from "./asset.model"

@Entity_()
export class OmnipoolAssetHistoricalData {
  constructor(props?: Partial<OmnipoolAssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * OmnipoolAssetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolAsset, {nullable: true})
  omnipoolAsset!: OmnipoolAsset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  stateCap!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  stateShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  stateHubReserve!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  stateProtocolShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balanceFree!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balanceFlags!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balanceFrozen!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balanceReserved!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balanceFeeFrozen!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balanceMiscFrozen!: bigint

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
