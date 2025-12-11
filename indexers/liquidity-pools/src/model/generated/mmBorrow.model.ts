import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
import {Event} from "./event.model"

@Entity_()
export class MmBorrow {
    constructor(props?: Partial<MmBorrow>) {
        Object.assign(this, props)
    }

    /**
     * <event_id>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    accountOnBehalfOfId!: string

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    @IntColumn_({nullable: true})
    interestRateMode!: number | undefined | null

    @BigIntColumn_({nullable: true})
    borrowRate!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    referralCode!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
