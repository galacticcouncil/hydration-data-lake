import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Stablepool} from "./stablepool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class StablepoolAssetData {
  constructor(props?: Partial<StablepoolAssetData>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stablepool, {nullable: true})
  pool!: Stablepool

  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
