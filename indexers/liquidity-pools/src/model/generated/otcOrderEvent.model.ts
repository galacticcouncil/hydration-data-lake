import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OtcOrder} from "./otcOrder.model"
import {OtcOrderStatus} from "./_otcOrderStatus"
import {Account} from "./account.model"
import {Swap} from "./swap.model"
import {Event} from "./event.model"

@Entity_()
export class OtcOrderEvent {
    constructor(props?: Partial<OtcOrderEvent>) {
        Object.assign(this, props)
    }

    /**
     * <otc_order_id>-<event_id>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: true})
    operationId!: string | undefined | null

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @Index_()
    @ManyToOne_(() => OtcOrder, {nullable: true})
    order!: OtcOrder

    @Index_()
    @Column_("varchar", {length: 15, nullable: true})
    eventName!: OtcOrderStatus | undefined | null

    @BigIntColumn_({nullable: true})
    amountIn!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    amountOut!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    fee!: bigint | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    filler!: Account | undefined | null

    @Index_()
    @ManyToOne_(() => Swap, {nullable: true})
    swap!: Swap | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
