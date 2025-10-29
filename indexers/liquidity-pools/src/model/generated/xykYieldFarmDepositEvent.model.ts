import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {XykYieldFarmDeposit} from "./xykYieldFarmDeposit.model"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {XykGlobalFarm} from "./xykGlobalFarm.model"
import {XykYieldFarm} from "./xykYieldFarm.model"
import {Asset} from "./asset.model"
import {Account} from "./account.model"
import {Event} from "./event.model"

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

    @Index_()
    @ManyToOne_(() => XykGlobalFarm, {nullable: true})
    globalFarm!: XykGlobalFarm

    @Index_()
    @ManyToOne_(() => XykYieldFarm, {nullable: true})
    yieldFarm!: XykYieldFarm

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    lpAsset!: Asset | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account | undefined | null

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    claimedAmount!: bigint | undefined | null

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    rewardAsset!: Asset | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
