import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Stablepool} from "./stablepool.model"
import {StablepoolAssetHistoricalData} from "./stablepoolAssetHistoricalData.model"

@Entity_()
export class StablepoolHistoricalData {
    constructor(props?: Partial<StablepoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @OneToMany_(() => StablepoolAssetHistoricalData, e => e.poolHistoricalData)
    assetsData!: StablepoolAssetHistoricalData[]

    @IntColumn_({nullable: false})
    initialAmplification!: number

    @IntColumn_({nullable: false})
    finalAmplification!: number

    @IntColumn_({nullable: false})
    initialBlock!: number

    @IntColumn_({nullable: false})
    finalBlock!: number

    @IntColumn_({nullable: false})
    fee!: number

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
