import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
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

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @StringColumn_({nullable: true})
    assetRegistryId!: string | undefined | null

    @BigIntColumn_({nullable: false})
    totalIssuance!: bigint

    @BigIntColumn_({nullable: false})
    existentialDeposit!: bigint

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

    @Index_()
    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
