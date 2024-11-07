import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
import {StablepoolHistoricalData} from "./stablepoolHistoricalData.model"

@Entity_()
export class StablepoolAssetHistoricalData {
    constructor(props?: Partial<StablepoolAssetHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Index_()
    @ManyToOne_(() => StablepoolHistoricalData, {nullable: true})
    poolHistoricalData!: StablepoolHistoricalData

    @BigIntColumn_({nullable: false})
    free!: bigint

    @BigIntColumn_({nullable: false})
    reserved!: bigint

    @BigIntColumn_({nullable: true})
    miscFrozen!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    feeFrozen!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    frozen!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    flags!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
