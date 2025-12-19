import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {XykpoolLifeState} from "./_xykpoolLifeState"
import {XykpoolVolumeHistoricalData} from "./xykpoolVolumeHistoricalData.model"
import {XykpoolHistoricalData} from "./xykpoolHistoricalData.model"

@Entity_()
export class Xykpool {
    constructor(props?: Partial<Xykpool>) {
        Object.assign(this, props)
    }

    /**
     * <address>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @StringColumn_({nullable: false})
    shareTokenId!: string

    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    createdAtParaBlockHeight!: number

    @IntColumn_({nullable: false})
    createdAtRelayBlockHeight!: number

    @StringColumn_({nullable: true})
    createdAtBlockId!: string | undefined | null

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new XykpoolLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
    lifeStates!: (XykpoolLifeState)[]

    @OneToMany_(() => XykpoolVolumeHistoricalData, e => e.pool)
    historicalVolume!: XykpoolVolumeHistoricalData[]

    @OneToMany_(() => XykpoolHistoricalData, e => e.pool)
    historicalData!: XykpoolHistoricalData[]
}
