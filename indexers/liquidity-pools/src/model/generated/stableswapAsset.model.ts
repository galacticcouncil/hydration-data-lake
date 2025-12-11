import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Stableswap} from "./stableswap.model"

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

    @StringColumn_({nullable: false})
    assetId!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
