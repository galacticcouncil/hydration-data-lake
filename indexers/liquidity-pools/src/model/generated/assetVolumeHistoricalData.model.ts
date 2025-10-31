import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"

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

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

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
