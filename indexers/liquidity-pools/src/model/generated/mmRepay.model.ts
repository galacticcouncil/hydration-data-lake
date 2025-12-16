import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"

@Entity_()
export class MmRepay {
    constructor(props?: Partial<MmRepay>) {
        Object.assign(this, props)
    }

    /**
     * <event_id>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @StringColumn_({nullable: false})
    assetId!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    repayerAccountId!: string

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    @BooleanColumn_({nullable: true})
    useATokens!: boolean | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
