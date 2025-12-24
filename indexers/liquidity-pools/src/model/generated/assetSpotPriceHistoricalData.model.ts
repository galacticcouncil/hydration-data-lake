import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {PriceRoute} from "./priceRoute.model"

@Entity_()
export class AssetSpotPriceHistoricalData {
    constructor(props?: Partial<AssetSpotPriceHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <assetInId>-<assetOutId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    assetInId!: string

    @StringColumn_({nullable: false})
    assetOutId!: string

    @BigIntColumn_({nullable: false})
    price!: bigint

    @StringColumn_({nullable: false})
    priceNormalised!: string

    @Index_()
    @ManyToOne_(() => PriceRoute, {nullable: true})
    priceRoute!: PriceRoute

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
