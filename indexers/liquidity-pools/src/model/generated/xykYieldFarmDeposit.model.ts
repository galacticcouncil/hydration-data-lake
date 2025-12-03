import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {XykYieldFarmEntry} from "./xykYieldFarmEntry.model"
import {XykYieldFarmDepositEvent} from "./xykYieldFarmDepositEvent.model"
import {Event} from "./event.model"

@Entity_()
export class XykYieldFarmDeposit {
  constructor(props?: Partial<XykYieldFarmDeposit>) {
    Object.assign(this, props)
  }

  /**
   * deposit ID
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  depositNftId!: string | undefined | null

  @Column_("text", {nullable: false})
  globalFarmId!: string

  @Column_("text", {nullable: false})
  yieldFarmId!: string

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetRegistryIds!: (string)[]

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("text", {nullable: false})
  lpAssetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sharesAmount!: bigint

  /**
   * should be either SharesDeposited or DepositDestroyed
   */
  @Column_("varchar", {length: 17, nullable: false})
  status!: YieldFarmDepositStatus

  @OneToMany_(() => XykYieldFarmEntry, e => e.deposit)
  entries!: XykYieldFarmEntry[]

  @OneToMany_(() => XykYieldFarmDepositEvent, e => e.deposit)
  depositEvents!: XykYieldFarmDepositEvent[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
