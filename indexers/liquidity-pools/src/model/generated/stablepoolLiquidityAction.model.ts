import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Stablepool} from "./stablepool.model"
import {StablepoolAssetLiquidityAmount} from "./stablepoolAssetLiquidityAmount.model"
import {LiquidityActionType} from "./_liquidityActionType"

@Entity_()
export class StablepoolLiquidityAction {
    constructor(props?: Partial<StablepoolLiquidityAction>) {
        Object.assign(this, props)
    }

    /**
     * poolId-paraChainBlockHeight-indexInBlock
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @BigIntColumn_({nullable: false})
    sharesAmount!: bigint

    @BigIntColumn_({nullable: false})
    feeAmount!: bigint

    @OneToMany_(() => StablepoolAssetLiquidityAmount, e => e.liquidityAction)
    assetAmounts!: StablepoolAssetLiquidityAmount[]

    @Column_("varchar", {length: 6, nullable: false})
    actionType!: LiquidityActionType

    @Index_()
    @IntColumn_({nullable: false})
    indexInBlock!: number

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
