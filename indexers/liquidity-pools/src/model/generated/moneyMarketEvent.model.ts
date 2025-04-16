import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {EvmEventName} from "./_evmEventName"
import {Transfer} from "./transfer.model"
import {MmSupply} from "./mmSupply.model"
import {MmWithdraw} from "./mmWithdraw.model"
import {MmBorrow} from "./mmBorrow.model"
import {MmRepay} from "./mmRepay.model"
import {MmUserEModeSet} from "./mmUserEModeSet.model"
import {MmLiquidationCall} from "./mmLiquidationCall.model"
import {MmReserveUsedAsCollateralEnabledEvent} from "./mmReserveUsedAsCollateralEnabledEvent.model"
import {MmReserveUsedAsCollateralDisabledEvent} from "./mmReserveUsedAsCollateralDisabledEvent.model"
import {Event} from "./event.model"

@Entity_()
export class MoneyMarketEvent {
  constructor(props?: Partial<MoneyMarketEvent>) {
    Object.assign(this, props)
  }

  /**
   * <event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("varchar", {length: 31, nullable: false})
  eventName!: EvmEventName

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetRegistryIds!: (string)[]

  @Index_()
  @Column_("text", {nullable: true})
  allInvolvedAssetDetails!: string | undefined | null

  @Column_("text", {array: true, nullable: false})
  allInvolvedParticipants!: (string)[]

  @Index_()
  @ManyToOne_(() => Transfer, {nullable: true})
  transfer!: Transfer | undefined | null

  @Index_()
  @ManyToOne_(() => MmSupply, {nullable: true})
  supply!: MmSupply | undefined | null

  @Index_()
  @ManyToOne_(() => MmWithdraw, {nullable: true})
  withdraw!: MmWithdraw | undefined | null

  @Index_()
  @ManyToOne_(() => MmBorrow, {nullable: true})
  borrow!: MmBorrow | undefined | null

  @Index_()
  @ManyToOne_(() => MmRepay, {nullable: true})
  repay!: MmRepay | undefined | null

  @Index_()
  @ManyToOne_(() => MmUserEModeSet, {nullable: true})
  userEModeSet!: MmUserEModeSet | undefined | null

  @Index_()
  @ManyToOne_(() => MmLiquidationCall, {nullable: true})
  liquidationCall!: MmLiquidationCall | undefined | null

  @Index_()
  @ManyToOne_(() => MmReserveUsedAsCollateralEnabledEvent, {nullable: true})
  reserveUsedAsCollateralEnabled!: MmReserveUsedAsCollateralEnabledEvent | undefined | null

  @Index_()
  @ManyToOne_(() => MmReserveUsedAsCollateralDisabledEvent, {nullable: true})
  reserveUsedAsCollateralDisabled!: MmReserveUsedAsCollateralDisabledEvent | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
