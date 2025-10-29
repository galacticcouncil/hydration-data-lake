import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Hsmpool} from "./hsmpool.model"
import {Asset} from "./asset.model"
import {Stableswap} from "./stableswap.model"

@Entity_()
export class HsmCollateral {
    constructor(props?: Partial<HsmCollateral>) {
        Object.assign(this, props)
    }

    /**
     * <hsmpool_address>-<colateral_id>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Hsmpool, {nullable: true})
    pool!: Hsmpool

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Index_()
    @ManyToOne_(() => Stableswap, {nullable: true})
    stableswap!: Stableswap

    @BooleanColumn_({nullable: false})
    isRemoved!: boolean
}
