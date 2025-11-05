import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolLiquidityPosition} from "./omnipoolLiquidityPosition.model"
import {Account} from "./account.model"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {OmnipoolYieldFarmEntry} from "./omnipoolYieldFarmEntry.model"
import {OmnipoolYieldFarmDepositEvent} from "./omnipoolYieldFarmDepositEvent.model"

@Entity_()
export class OmnipoolYieldFarmDeposit {
  constructor(props?: Partial<OmnipoolYieldFarmDeposit>) {
    Object.assign(this, props)
  }

  /**
   * deposit ID
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  depositNftId!: string

  @Column_("text", {nullable: false})
  globalFarmId!: string

  @Column_("text", {nullable: false})
  yieldFarmId!: string

  @Index_()
  @ManyToOne_(() => OmnipoolLiquidityPosition, {nullable: true})
  position!: OmnipoolLiquidityPosition

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("text", {nullable: false})
  assetId!: string

  /**
   * should be either SharesDeposited or DepositDestroyed
   */
  @Column_("varchar", {length: 17, nullable: false})
  status!: YieldFarmDepositStatus

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sharesAmount!: bigint

  @OneToMany_(() => OmnipoolYieldFarmEntry, e => e.deposit)
  entries!: OmnipoolYieldFarmEntry[]

  @OneToMany_(() => OmnipoolYieldFarmDepositEvent, e => e.deposit)
  depositEvents!: OmnipoolYieldFarmDepositEvent[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  event!: string
}
