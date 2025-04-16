import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolYieldFarmDeposit} from "./omnipoolYieldFarmDeposit.model"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {OmnipoolGlobalFarm} from "./omnipoolGlobalFarm.model"
import {OmnipoolYieldFarm} from "./omnipoolYieldFarm.model"
import {Asset} from "./asset.model"
import {Account} from "./account.model"
import {OmnipoolLiquidityPosition} from "./omnipoolLiquidityPosition.model"
import {Event} from "./event.model"

@Entity_()
export class OmnipoolYieldFarmDepositEvent {
  constructor(props?: Partial<OmnipoolYieldFarmDepositEvent>) {
    Object.assign(this, props)
  }

  /**
   * event_id
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolYieldFarmDeposit, {nullable: true})
  deposit!: OmnipoolYieldFarmDeposit

  @Column_("varchar", {length: 17, nullable: false})
  eventName!: YieldFarmDepositStatus

  @Index_()
  @ManyToOne_(() => OmnipoolGlobalFarm, {nullable: true})
  globalFarm!: OmnipoolGlobalFarm

  @Index_()
  @ManyToOne_(() => OmnipoolYieldFarm, {nullable: true})
  yieldFarm!: OmnipoolYieldFarm

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account | undefined | null

  @Index_()
  @ManyToOne_(() => OmnipoolLiquidityPosition, {nullable: true})
  position!: OmnipoolLiquidityPosition | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  sharesAmount!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  claimedAmount!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  rewardAsset!: Asset | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
