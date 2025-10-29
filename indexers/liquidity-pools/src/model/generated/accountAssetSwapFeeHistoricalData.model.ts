import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AccountSwapFeeHistoricalData} from "./accountSwapFeeHistoricalData.model"
import {Account} from "./account.model"
import {Asset} from "./asset.model"

@Entity_()
export class AccountAssetSwapFeeHistoricalData {
  constructor(props?: Partial<AccountAssetSwapFeeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <historicalAccountSwapFeeId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => AccountSwapFeeHistoricalData, {nullable: true})
  collection!: AccountSwapFeeHistoricalData

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalAmount!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
