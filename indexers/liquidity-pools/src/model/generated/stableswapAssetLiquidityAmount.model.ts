import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {StableswapLiquidityEvent} from "./stableswapLiquidityEvent.model"
import {Asset} from "./asset.model"

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

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
