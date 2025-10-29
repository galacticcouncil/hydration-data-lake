import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
import {MoneyMarketReserve} from "./moneyMarketReserve.model"
import {AavepoolHistoricalData} from "./aavepoolHistoricalData.model"

@Entity_()
export class Aavepool {
    constructor(props?: Partial<Aavepool>) {
        Object.assign(this, props)
    }

    /**
     * <address> - address is derived from reserve_asset_id + aToken_id
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    reserveAsset!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    aToken!: Asset

    @Index_()
    @ManyToOne_(() => MoneyMarketReserve, {nullable: true})
    moneyMarketReserve!: MoneyMarketReserve | undefined | null

    @OneToMany_(() => AavepoolHistoricalData, e => e.pool)
    historicalData!: AavepoolHistoricalData[]
}
