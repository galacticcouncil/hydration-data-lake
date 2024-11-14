import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {XykPool} from "./xykPool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class XykPoolAssetsData {
  constructor(props?: Partial<XykPoolAssetsData>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => XykPool, {nullable: true})
  pool!: XykPool

  @Index_()
  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => new AccountBalances(undefined, marshal.nonNull(obj))}, nullable: false})
  balances!: AccountBalances

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
