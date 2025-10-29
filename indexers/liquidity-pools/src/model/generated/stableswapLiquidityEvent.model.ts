import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetLiquidityAmount} from "./stableswapAssetLiquidityAmount.model"
import {LiquidityActionEvent} from "./_liquidityActionEvent"
import {Event} from "./event.model"

@Entity_()
export class StableswapLiquidityEvent {
    constructor(props?: Partial<StableswapLiquidityEvent>) {
        Object.assign(this, props)
    }

    /**
     * <stableswapId>-<eventId>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @Index_()
    @ManyToOne_(() => Stableswap, {nullable: true})
    pool!: Stableswap

    @BigIntColumn_({nullable: false})
    sharesAmount!: bigint

    @BigIntColumn_({nullable: false})
    feeAmount!: bigint

    @OneToMany_(() => StableswapAssetLiquidityAmount, e => e.liquidityAction)
    assetAmounts!: StableswapAssetLiquidityAmount[]

    @Column_("varchar", {length: 6, nullable: false})
    actionType!: LiquidityActionEvent

    @Index_()
    @IntColumn_({nullable: false})
    indexInBlock!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
