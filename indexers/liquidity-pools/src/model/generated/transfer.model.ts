import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {AssetType} from "./_assetType"
import {Event} from "./event.model"

@Entity_()
export class Transfer {
    constructor(props?: Partial<Transfer>) {
        Object.assign(this, props)
    }

    /**
     * <eventId> (e.g. 0000059948-e5832-000007)
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @StringColumn_({nullable: false})
    assetId!: string

    @Column_("varchar", {length: 10, nullable: false})
    assetType!: AssetType

    @StringColumn_({nullable: false})
    fromId!: string

    @StringColumn_({nullable: false})
    toId!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    txFee!: bigint

    @Index_()
    @DateTimeColumn_({nullable: false})
    paraTimestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
