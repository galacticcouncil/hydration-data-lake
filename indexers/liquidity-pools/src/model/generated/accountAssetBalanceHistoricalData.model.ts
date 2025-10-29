import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"

@Entity_()
export class AccountAssetBalanceHistoricalData {
  constructor(props?: Partial<AccountAssetBalanceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  /**
   * free property in storage
   */
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  transferable!: bigint

  /**
   * reserved property in storage
   */
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalLocked!: bigint

  @Column_("text", {nullable: true})
  transferableInRefAssetNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  totalLockedInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
