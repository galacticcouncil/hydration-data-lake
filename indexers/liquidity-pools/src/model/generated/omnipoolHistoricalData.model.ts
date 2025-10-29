import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Omnipool} from "./omnipool.model"
import {OmnipoolAssetHistoricalData} from "./omnipoolAssetHistoricalData.model"

@Entity_()
export class OmnipoolHistoricalData {
    constructor(props?: Partial<OmnipoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <omnipoolId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-101312)
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Omnipool, {nullable: true})
    pool!: Omnipool

    @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.poolHistoricalData)
    assetsHistoricalData!: OmnipoolAssetHistoricalData[]

    @StringColumn_({nullable: true})
    tvlTotalInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
