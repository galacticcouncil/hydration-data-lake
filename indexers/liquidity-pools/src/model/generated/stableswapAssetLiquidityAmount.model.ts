import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {StableswapLiquidityEvent} from "./stableswapLiquidityEvent.model"

@Entity_()
export class StableswapAssetLiquidityAmount {
    constructor(props?: Partial<StableswapAssetLiquidityAmount>) {
        Object.assign(this, props)
    }

    /**
     * <stableswapId>-<eventId>-<assetId>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => StableswapLiquidityEvent, {nullable: true})
    liquidityAction!: StableswapLiquidityEvent

    @StringColumn_({nullable: false})
    assetId!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
