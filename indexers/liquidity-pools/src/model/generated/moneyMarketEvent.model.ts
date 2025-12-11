import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {EvmContractName} from "./_evmContractName"
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

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @Column_("varchar", {length: 24, nullable: true})
    contractName!: EvmContractName | undefined | null

    @Column_("varchar", {length: 32, nullable: true})
    eventName!: EvmEventName | undefined | null

    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetIds!: (string)[]

    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetRegistryIds!: (string)[]

    @Index_()
    @StringColumn_({nullable: true})
    allInvolvedAssetDetails!: string | undefined | null

    @StringColumn_({array: true, nullable: false})
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
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
