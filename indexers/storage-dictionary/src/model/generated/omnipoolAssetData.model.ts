import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Omnipool} from "./omnipool.model"
import {AccountBalances} from "./_accountBalances"
import {OmnipoolAssetState} from "./_omnipoolAssetState"

@Entity_()
export class OmnipoolAssetData {
  constructor(props?: Partial<OmnipoolAssetData>) {
    Object.assign(this, props)
  }

  /**
   * omnipooAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  pool!: Omnipool

  @Index_()
  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new OmnipoolAssetState(undefined, marshal.nonNull(obj))}, nullable: false})
  assetState!: OmnipoolAssetState

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
