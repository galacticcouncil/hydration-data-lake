import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"

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

    @StringColumn_({nullable: false})
    depositId!: string

    @StringColumn_({nullable: false})
    positionId!: string

    @Column_("varchar", {length: 17, nullable: false})
    eventName!: YieldFarmDepositStatus

    @StringColumn_({nullable: true})
    globalFarmId!: string | undefined | null

    @StringColumn_({nullable: true})
    yieldFarmId!: string | undefined | null

    @StringColumn_({nullable: true})
    assetId!: string | undefined | null

    @StringColumn_({nullable: true})
    accountId!: string | undefined | null

    @BigIntColumn_({nullable: true})
    sharesAmount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    claimedAmount!: bigint | undefined | null

    @StringColumn_({nullable: true})
    rewardAssetId!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: true})
    eventId!: string | undefined | null
}
