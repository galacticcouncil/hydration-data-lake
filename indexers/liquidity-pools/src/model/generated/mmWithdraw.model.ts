import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {RoutedTrade} from "./routedTrade.model"
import {Event} from "./event.model"

@Entity_()
export class MmWithdraw {
    constructor(props?: Partial<MmWithdraw>) {
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

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    accountFrom!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    accountTo!: Account

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    @Index_()
    @ManyToOne_(() => RoutedTrade, {nullable: true})
    initiatedByTrade!: RoutedTrade | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
