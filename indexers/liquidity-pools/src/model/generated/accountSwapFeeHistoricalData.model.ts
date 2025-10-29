import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {AccountAssetSwapFeeHistoricalData} from "./accountAssetSwapFeeHistoricalData.model"

@Entity_()
export class AccountSwapFeeHistoricalData {
  constructor(props?: Partial<AccountSwapFeeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @OneToMany_(() => AccountAssetSwapFeeHistoricalData, e => e.collection)
  fees!: AccountAssetSwapFeeHistoricalData[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
