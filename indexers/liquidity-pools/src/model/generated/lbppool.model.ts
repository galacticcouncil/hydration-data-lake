import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {LbppoolLifeState} from "./_lbppoolLifeState"
import {LbppoolPriceHistoricalData} from "./lbppoolPriceHistoricalData.model"
import {LbppoolVolumeHistoricalData} from "./lbppoolVolumeHistoricalData.model"
import {LbppoolHistoricalData} from "./lbppoolHistoricalData.model"

@Entity_()
export class Lbppool {
    constructor(props?: Partial<Lbppool>) {
        Object.assign(this, props)
    }

    /**
     * <poolAccountAddress>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    feeCollector!: Account | undefined | null

    @IntColumn_({nullable: true})
    startBlockNumber!: number | undefined | null

    @IntColumn_({nullable: true})
    endBlockNumber!: number | undefined | null

    @IntColumn_({nullable: true})
    initialWeight!: number | undefined | null

    @IntColumn_({nullable: true})
    finalWeight!: number | undefined | null

    @IntColumn_({array: true, nullable: true})
    fee!: (number | undefined | null)[] | undefined | null

    @BigIntColumn_({nullable: true})
    repayTarget!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    createdAtParaBlockHeight!: number

    @IntColumn_({nullable: false})
    createdAtRelayBlockHeight!: number

    @StringColumn_({nullable: true})
    createdAtBlockId!: string | undefined | null

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new LbppoolLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
    lifeStates!: (LbppoolLifeState)[]

    @OneToMany_(() => LbppoolPriceHistoricalData, e => e.pool)
    historicalBlockPrices!: LbppoolPriceHistoricalData[]

    @OneToMany_(() => LbppoolVolumeHistoricalData, e => e.pool)
    historicalVolume!: LbppoolVolumeHistoricalData[]

    @OneToMany_(() => LbppoolHistoricalData, e => e.pool)
    historicalData!: LbppoolHistoricalData[]
}
