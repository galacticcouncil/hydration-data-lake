import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {StablepoolLiquidityAction} from "./stablepoolLiquidityAction.model"
import {Asset} from "./asset.model"

@Entity_()
export class StablepoolAssetLiquidityAmount {
    constructor(props?: Partial<StablepoolAssetLiquidityAmount>) {
        Object.assign(this, props)
    }

    /**
     * poolId-assetId-paraChainBlockHeight-indexInBlock
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => StablepoolLiquidityAction, {nullable: true})
    liquidityAction!: StablepoolLiquidityAction

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
