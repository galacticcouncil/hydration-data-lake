import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {NftAsset} from "./nftAsset.model"
import {OmnipoolGlobalFarm} from "./omnipoolGlobalFarm.model"
import {OmnipoolYieldFarm} from "./omnipoolYieldFarm.model"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
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

  @Index_()
  @ManyToOne_(() => NftAsset, {nullable: true})
  depositNft!: NftAsset

  @Index_()
  @ManyToOne_(() => OmnipoolGlobalFarm, {nullable: true})
  globalFarm!: OmnipoolGlobalFarm

  @Index_()
  @ManyToOne_(() => OmnipoolYieldFarm, {nullable: true})
  yieldFarm!: OmnipoolYieldFarm

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssets!: (string)[]

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  lpAsset!: Asset

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

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
