import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetHistoricalData} from "./stableswapAssetHistoricalData.model"
import {StableswapPegsSource} from "./_stableswapPegsSource"

@Entity_()
export class StableswapHistoricalData {
    constructor(props?: Partial<StableswapHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <stableswapId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stableswap, {nullable: true})
    pool!: Stableswap

    @OneToMany_(() => StableswapAssetHistoricalData, e => e.poolHistoricalData)
    assetsHistoricalData!: StableswapAssetHistoricalData[]

    @IntColumn_({nullable: false})
    initialAmplification!: number

    @IntColumn_({nullable: false})
    finalAmplification!: number

    @IntColumn_({nullable: false})
    initialAmplificationChangeAtBlockHeight!: number

    @IntColumn_({nullable: false})
    finalAmplificationChangeAtBlockHeight!: number

    @IntColumn_({nullable: false})
    fee!: number

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.map((val: any) => marshal.bigint.toJSON(val))), from: obj => obj == null ? undefined : marshal.fromList(obj, val => marshal.fromList(val, val => marshal.bigint.fromJSON(val)))}, nullable: false})
    pegs!: ((bigint)[])[]

    @IntColumn_({nullable: true})
    maxPegUpdate!: number | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new StableswapPegsSource(undefined, marshal.nonNull(val)))}, nullable: true})
    pegSources!: (StableswapPegsSource)[] | undefined | null

    @StringColumn_({nullable: true})
    tvlTotalInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
