import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"

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

    @Column_("jsonb", {transformer: {to: obj => obj, from: obj => obj == null ? undefined : marshal.fromList(obj, val => marshal.fromList(val, val => marshal.string.fromJSON(val)))}, nullable: false})
    priceRoute!: ((string)[])[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
