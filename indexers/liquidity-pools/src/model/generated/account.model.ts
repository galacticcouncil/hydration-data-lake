import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {AccountType} from "./_accountType"
import {LbpPool} from "./lbpPool.model"
import {XykPool} from "./xykPool.model"
import {Omnipool} from "./omnipool.model"
import {Stablepool} from "./stablepool.model"
import {Swap} from "./swap.model"
import {Transfer} from "./transfer.model"
import {ChainActivityTrace} from "./chainActivityTrace.model"
import {AccountChainActivityTrace} from "./accountChainActivityTrace.model"
import {DcaSchedule} from "./dcaSchedule.model"
import {OtcOrder} from "./otcOrder.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  /**
   * Account pubkey
   */
  @PrimaryColumn_()
  id!: string

  @Column_("varchar", {length: 10, nullable: false})
  accountType!: AccountType

  @Index_()
  @ManyToOne_(() => LbpPool, {nullable: true})
  lbpPool!: LbpPool | undefined | null

  @Index_()
  @ManyToOne_(() => XykPool, {nullable: true})
  xykPool!: XykPool | undefined | null

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  omnipool!: Omnipool | undefined | null

  @Index_()
  @ManyToOne_(() => Stablepool, {nullable: true})
  stablepool!: Stablepool | undefined | null

  @OneToMany_(() => Swap, e => e.swapper)
  initiatedSwaps!: Swap[]

  @OneToMany_(() => Swap, e => e.filler)
  filledSwaps!: Swap[]

  @OneToMany_(() => Transfer, e => e.to)
  transfersTo!: Transfer[]

  @OneToMany_(() => Transfer, e => e.from)
  transfersFrom!: Transfer[]

  @OneToMany_(() => ChainActivityTrace, e => e.originator)
  initiatedChainActivities!: ChainActivityTrace[]

  @OneToMany_(() => AccountChainActivityTrace, e => e.account)
  participatedChainActivities!: AccountChainActivityTrace[]

  @OneToMany_(() => DcaSchedule, e => e.owner)
  dcaSchedules!: DcaSchedule[]

  @OneToMany_(() => OtcOrder, e => e.owner)
  otcOrders!: OtcOrder[]
}
