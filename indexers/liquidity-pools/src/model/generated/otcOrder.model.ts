import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OtcOrderStatus} from "./_otcOrderStatus"
import {OtcOrderEvent} from "./otcOrderEvent.model"

@Entity_()
export class OtcOrder {
    constructor(props?: Partial<OtcOrder>) {
        Object.assign(this, props)
    }

    /**
     * <orderId> as string
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    ownerId!: string

    @StringColumn_({nullable: false})
    assetInId!: string

    @StringColumn_({nullable: false})
    assetOutId!: string

    @BigIntColumn_({nullable: false})
    amountOut!: bigint

    @BigIntColumn_({nullable: false})
    amountIn!: bigint

    @BooleanColumn_({nullable: true})
    partiallyFillable!: boolean | undefined | null

    @Index_()
    @Column_("varchar", {length: 15, nullable: true})
    status!: OtcOrderStatus | undefined | null

    @BigIntColumn_({nullable: true})
    totalFilledAmountIn!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    totalFilledAmountOut!: bigint | undefined | null

    @OneToMany_(() => OtcOrderEvent, e => e.order)
    events!: OtcOrderEvent[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
