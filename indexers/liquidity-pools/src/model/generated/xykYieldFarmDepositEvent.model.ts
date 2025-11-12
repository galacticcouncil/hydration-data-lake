import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {XykYieldFarmDeposit} from "./xykYieldFarmDeposit.model"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"

@Entity_()
export class XykYieldFarmDepositEvent {
  constructor(props?: Partial<XykYieldFarmDepositEvent>) {
    Object.assign(this, props)
  }

  /**
   * event_id
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => XykYieldFarmDeposit, {nullable: true})
  deposit!: XykYieldFarmDeposit

  @Column_("varchar", {length: 17, nullable: false})
  eventName!: YieldFarmDepositStatus

  @Column_("text", {nullable: false})
  globalFarmId!: string

  @Column_("text", {nullable: false})
  yieldFarmId!: string

  @Column_("text", {nullable: true})
  lpAssetId!: string | undefined | null

  @Column_("text", {nullable: true})
  accountId!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amount!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  claimedAmount!: bigint | undefined | null

  @Column_("text", {nullable: true})
  rewardAssetId!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  eventId!: string
}
