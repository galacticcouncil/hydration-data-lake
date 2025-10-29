import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {AssetHistoricalData} from "./assetHistoricalData.model"
import {Asset} from "./asset.model"

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

    @Index_()
    @ManyToOne_(() => AssetHistoricalData, {nullable: true})
    assetInHistData!: AssetHistoricalData

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetIn!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetOut!: Asset

    @StringColumn_({nullable: true})
    assetInAssetRegistryId!: string | undefined | null

    @StringColumn_({nullable: true})
    assetOutAssetRegistryId!: string | undefined | null

    @IntColumn_({nullable: false})
    assetOutDecimals!: number

    @BigIntColumn_({nullable: false})
    price!: bigint

    @StringColumn_({nullable: false})
    priceNormalised!: string

    @Column_("jsonb", {transformer: {to: obj => obj, from: obj => obj == null ? undefined : marshal.fromList(obj, val => marshal.fromList(val, val => marshal.string.fromJSON(val)))}, nullable: false})
    priceRoute!: ((string)[])[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
