import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Aavepool} from "./aavepool.model"
import {MmReserveIndexesHistoricalData} from "./mmReserveIndexesHistoricalData.model"
import {MmReserveConfigHistoricalData} from "./mmReserveConfigHistoricalData.model"

@Entity_()
export class MoneyMarketReserve {
    constructor(props?: Partial<MoneyMarketReserve>) {
        Object.assign(this, props)
    }

    /**
     * <underlying_asset_address>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    aTokenId!: string

    @StringColumn_({nullable: false})
    underlyingAssetId!: string

    @StringColumn_({nullable: false})
    variableDebtTokenId!: string

    @Index_()
    @ManyToOne_(() => Aavepool, {nullable: true})
    aavePool!: Aavepool | undefined | null

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    symbol!: string

    @IntColumn_({nullable: false})
    decimals!: number

    @OneToMany_(() => MmReserveIndexesHistoricalData, e => e.reserve)
    indexesHistoricalData!: MmReserveIndexesHistoricalData[]

    @OneToMany_(() => MmReserveConfigHistoricalData, e => e.reserve)
    configHistoricalData!: MmReserveConfigHistoricalData[]
}
