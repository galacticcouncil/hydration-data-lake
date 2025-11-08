import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {EmbeddedAsset} from "./_embeddedAsset"
import {AssetDynamicFee} from "./_assetDynamicFee"
import {AssetSpotPriceHistoricalData} from "./assetSpotPriceHistoricalData.model"
import {AssetAssetsPairVolume} from "./assetAssetsPairVolume.model"

@Entity_()
export class AssetHistoricalData {
    constructor(props?: Partial<AssetHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <assetId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new EmbeddedAsset(undefined, obj)}, nullable: false})
    asset!: EmbeddedAsset

    @BigIntColumn_({nullable: false})
    totalIssuance!: bigint

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new AssetDynamicFee(undefined, obj)}, nullable: true})
    dynamicFee!: AssetDynamicFee | undefined | null

    @StringColumn_({nullable: false})
    usdPriceNormalised!: string

    @OneToMany_(() => AssetSpotPriceHistoricalData, e => e.assetInHistData)
    spotPrices!: AssetSpotPriceHistoricalData[]

    @OneToMany_(() => AssetAssetsPairVolume, e => e.assetHistoricalData)
    assetPairVolumes!: AssetAssetsPairVolume[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
