import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
import {HsmCollateral} from "./hsmCollateral.model"
import {AaveFacilitatorHistoricalData} from "./aaveFacilitatorHistoricalData.model"

@Entity_()
export class HsmpoolAssetHistoricalData {
    constructor(props?: Partial<HsmpoolAssetHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <asset_id>-<block_height>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    /**
     * Can be null if snapshot is for Hollar
     */
    @Index_()
    @ManyToOne_(() => HsmCollateral, {nullable: true})
    collateral!: HsmCollateral | undefined | null

    /**
     * Actual only for Hollar asset as Hsm pool doesn't have any balance of Hollar
     */
    @Index_()
    @ManyToOne_(() => AaveFacilitatorHistoricalData, {nullable: true})
    facilitatorHistData!: AaveFacilitatorHistoricalData | undefined | null

    /**
     * Can be 0 for Hollar as HSM pool 
     */
    @BigIntColumn_({nullable: false})
    freeBalance!: bigint

    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @BigIntColumn_({nullable: false})
    assetVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetFeeVol!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalFeesVol!: bigint

    @StringColumn_({nullable: false})
    assetVolInNorm!: string

    @StringColumn_({nullable: false})
    assetVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetFeeVolNorm!: string

    @StringColumn_({nullable: false})
    assetTotalVolInNorm!: string

    @StringColumn_({nullable: false})
    assetTotalVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetTotalFeesVolNorm!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    paraTimestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
