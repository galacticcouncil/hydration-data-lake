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

    @StringColumn_({nullable: false})
    totalVolumeInNorm!: string

    @StringColumn_({nullable: false})
    totalVolumeOutNorm!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
