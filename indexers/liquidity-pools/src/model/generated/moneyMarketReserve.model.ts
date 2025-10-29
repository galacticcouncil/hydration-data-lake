import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
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

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    aToken!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    underlyingAsset!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    variableDebtToken!: Asset

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
