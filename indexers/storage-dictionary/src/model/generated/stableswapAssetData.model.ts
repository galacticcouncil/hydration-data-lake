import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Stableswap} from "./stableswap.model"
import {Tradability} from "./_tradability"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class StableswapAssetData {
  constructor(props?: Partial<StableswapAssetData>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  pool!: Stableswap

  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new Tradability(undefined, obj)}, nullable: true})
  tradable!: Tradability | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
