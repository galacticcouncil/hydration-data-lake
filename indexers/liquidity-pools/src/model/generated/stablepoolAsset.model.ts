import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Stablepool} from "./stablepool.model"
import {Asset} from "./asset.model"

@Entity_()
export class StablepoolAsset {
    constructor(props?: Partial<StablepoolAsset>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-assetId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
