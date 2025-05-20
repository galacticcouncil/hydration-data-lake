import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Xykpool} from "./xykpool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class XykpoolAssetsData {
  constructor(props?: Partial<XykpoolAssetsData>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  pool!: Xykpool

  @Index_()
  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
