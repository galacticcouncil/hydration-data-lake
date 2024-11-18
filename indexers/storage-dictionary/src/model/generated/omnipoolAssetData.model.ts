import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AccountBalances} from "./_accountBalances"
import {OmnipoolAssetState} from "./_omnipoolAssetState"

@Entity_()
export class OmnipoolAssetData {
  constructor(props?: Partial<OmnipoolAssetData>) {
    Object.assign(this, props)
  }

  /**
   * omnipooAddress-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  poolAddress!: string

  @Index_()
  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new OmnipoolAssetState(undefined, marshal.nonNull(obj))}, nullable: false})
  assetState!: OmnipoolAssetState

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number
}
