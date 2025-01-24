import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {AccountType} from "./_accountType"
import {AccountAssetBalanceData} from "./accountAssetBalanceData.model"
import {AccountAssetBalanceHistoricalData} from "./accountAssetBalanceHistoricalData.model"
import {Lbppool} from "./lbppool.model"
import {Xykpool} from "./xykpool.model"
import {Omnipool} from "./omnipool.model"
import {Stableswap} from "./stableswap.model"
import {ChainActivityTrace} from "./chainActivityTrace.model"
import {AccountChainActivityTrace} from "./accountChainActivityTrace.model"
import {Swap} from "./swap.model"
import {Transfer} from "./transfer.model"
import {DcaSchedule} from "./dcaSchedule.model"
import {OtcOrder} from "./otcOrder.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  /**
   * <address>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("varchar", {length: 10, nullable: false})
  accountType!: AccountType

  @OneToMany_(() => AccountAssetBalanceData, e => e.account)
  assetBalanceData!: AccountAssetBalanceData[]

  @OneToMany_(() => AccountAssetBalanceHistoricalData, e => e.account)
  assetBalanceHistoricalData!: AccountAssetBalanceHistoricalData[]

  @Index_()
  @ManyToOne_(() => Lbppool, {nullable: true})
  lbppool!: Lbppool | undefined | null

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  xykpool!: Xykpool | undefined | null

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  omnipool!: Omnipool | undefined | null

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  stableswap!: Stableswap | undefined | null

  @OneToMany_(() => ChainActivityTrace, e => e.originator)
  initiatedActions!: ChainActivityTrace[]

  @OneToMany_(() => AccountChainActivityTrace, e => e.account)
  participatedActions!: AccountChainActivityTrace[]

  @OneToMany_(() => Swap, e => e.swapper)
  initiatedSwaps!: Swap[]

  @OneToMany_(() => Swap, e => e.filler)
  filledSwaps!: Swap[]

  @OneToMany_(() => Transfer, e => e.to)
  transfersTo!: Transfer[]

  @OneToMany_(() => Transfer, e => e.from)
  transfersFrom!: Transfer[]

  @OneToMany_(() => DcaSchedule, e => e.owner)
  dcaSchedules!: DcaSchedule[]

  @OneToMany_(() => OtcOrder, e => e.owner)
  otcOrders!: OtcOrder[]
}
