import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {LbpPoolHistoricalPrice} from "./lbpPoolHistoricalPrice.model"
import {LbpPoolHistoricalVolume} from "./lbpPoolHistoricalVolume.model"
import {LbpPoolHistoricalData} from "./lbpPoolHistoricalData.model"
import {LbpPoolOperation} from "./lbpPoolOperation.model"

@Entity_()
export class LbpPool {
    constructor(props?: Partial<LbpPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetA!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetB!: Asset

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtParaBlock!: number

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @IntColumn_({nullable: true})
    destroyedAtParaBlock!: number | undefined | null

    @IntColumn_({nullable: true})
    startBlockNumber!: number | undefined | null

    @IntColumn_({nullable: true})
    endBlockNumber!: number | undefined | null

    @IntColumn_({array: true, nullable: true})
    fee!: (number | undefined | null)[] | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    feeCollector!: Account | undefined | null

    @BigIntColumn_({nullable: true})
    repayTarget!: bigint | undefined | null

    @IntColumn_({nullable: true})
    initialWeight!: number | undefined | null

    @IntColumn_({nullable: true})
    finalWeight!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @OneToMany_(() => LbpPoolHistoricalPrice, e => e.pool)
    historicalBlockPrices!: LbpPoolHistoricalPrice[]

    @OneToMany_(() => LbpPoolHistoricalVolume, e => e.pool)
    historicalVolume!: LbpPoolHistoricalVolume[]

    @OneToMany_(() => LbpPoolHistoricalData, e => e.pool)
    historicalData!: LbpPoolHistoricalData[]

    @OneToMany_(() => LbpPoolOperation, e => e.pool)
    operations!: LbpPoolOperation[]
}
