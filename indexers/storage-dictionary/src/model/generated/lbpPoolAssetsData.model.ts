import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LbpPool} from "./lbpPool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class LbpPoolAssetsData {
  constructor(props?: Partial<LbpPoolAssetsData>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => LbpPool, {nullable: true})
  pool!: LbpPool

  @Index_()
  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number
}
