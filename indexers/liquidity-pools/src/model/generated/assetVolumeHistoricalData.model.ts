import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class AssetVolumeHistoricalData {
    constructor(props?: Partial<AssetVolumeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <assetId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    assetId!: string

    @BigIntColumn_({nullable: false})
    volumeIn!: bigint

    @BigIntColumn_({nullable: false})
    volumeOut!: bigint

    @BigIntColumn_({nullable: false})
    totalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    totalVolumeOut!: bigint

    @StringColumn_({nullable: true})
    volumeInNorm!: string | undefined | null

    @StringColumn_({nullable: true})
    volumeOutNorm!: string | undefined | null

    @StringColumn_({nullable: true})
    totalVolumeInNorm!: string | undefined | null

    @StringColumn_({nullable: true})
    totalVolumeOutNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
