import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
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

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetIn!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetOut!: Asset

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

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
