import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {LbpPoolAssetsData} from "./lbpPoolAssetsData.model"

@Entity_()
export class LbpPool {
    constructor(props?: Partial<LbpPool>) {
        Object.assign(this, props)
    }

    /**
     * xykPoolAddress-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    /**
     * XYK pool address
     */
    @Index_()
    @StringColumn_({nullable: false})
    poolAddress!: string

    @Index_()
    @IntColumn_({nullable: false})
    assetAId!: number

    @Index_()
    @IntColumn_({nullable: false})
    assetBId!: number

    @StringColumn_({nullable: false})
    owner!: string

    @IntColumn_({nullable: true})
    start!: number | undefined | null

    @IntColumn_({nullable: true})
    end!: number | undefined | null

    @IntColumn_({nullable: false})
    initialWeight!: number

    @IntColumn_({nullable: false})
    finalWeight!: number

    @StringColumn_({nullable: false})
    weightCurve!: string

    @IntColumn_({array: true, nullable: false})
    fee!: (number)[]

    @StringColumn_({nullable: true})
    feeCollector!: string | undefined | null

    @BigIntColumn_({nullable: false})
    repayTarget!: bigint

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number

    @OneToMany_(() => LbpPoolAssetsData, e => e.pool)
    assets!: LbpPoolAssetsData[]
}
