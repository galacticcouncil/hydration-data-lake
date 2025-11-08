import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"

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

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetRegistryAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @StringColumn_({nullable: false})
    assetRegistryBId!: string

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

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
