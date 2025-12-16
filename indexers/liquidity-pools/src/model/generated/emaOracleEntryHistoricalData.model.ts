import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {EmaOraclePeriod} from "./_emaOraclePeriod"

@Entity_()
export class EmaOracleEntryHistoricalData {
    constructor(props?: Partial<EmaOracleEntryHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <paraBlockHeight>-<assetAId>-<assetBId>-<source>-<period>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @StringColumn_({nullable: false})
    assetAAssetRegistryId!: string

    @StringColumn_({nullable: false})
    assetBAssetRegistryId!: string

    @Index_()
    @StringColumn_({nullable: false})
    source!: string

    @Column_("varchar", {length: 10, nullable: false})
    period!: EmaOraclePeriod

    @BigIntColumn_({nullable: false})
    numeratorPrice!: bigint

    @BigIntColumn_({nullable: false})
    denominatorPrice!: bigint

    @BigIntColumn_({nullable: false})
    assetAInVolume!: bigint

    @BigIntColumn_({nullable: false})
    assetAOutVolume!: bigint

    @BigIntColumn_({nullable: false})
    assetBInVolume!: bigint

    @BigIntColumn_({nullable: false})
    assetBOutVolume!: bigint

    @BigIntColumn_({nullable: false})
    assetALiquidity!: bigint

    @BigIntColumn_({nullable: false})
    assetBLiquidity!: bigint

    @IntColumn_({nullable: false})
    updatedAtParaBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
