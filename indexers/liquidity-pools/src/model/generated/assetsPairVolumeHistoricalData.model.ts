import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"

@Entity_()
export class AssetsPairVolumeHistoricalData {
    constructor(props?: Partial<AssetsPairVolumeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <assetAId>-<assetBId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetA!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetB!: Asset

    @BigIntColumn_({nullable: false})
    assetAVolume!: bigint

    @BigIntColumn_({nullable: false})
    assetBVolume!: bigint

    /**
     * totalVolumeNormalised is calculated in base asset (10:USDT) and normalised to decimal format
     */
    @StringColumn_({nullable: false})
    totalVolumeNormalised!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
