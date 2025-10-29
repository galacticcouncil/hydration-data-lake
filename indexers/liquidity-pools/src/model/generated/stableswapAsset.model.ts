import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Stableswap} from "./stableswap.model"
import {Asset} from "./asset.model"

@Entity_()
export class StableswapAsset {
    constructor(props?: Partial<StableswapAsset>) {
        Object.assign(this, props)
    }

    /**
     * <stableswapId>-<assetId> (e.g. 101-19)
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stableswap, {nullable: true})
    pool!: Stableswap

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
