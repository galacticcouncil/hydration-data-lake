import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {StablepoolAssetData} from "./stablepoolAssetData.model"

@Entity_()
export class Stablepool {
    constructor(props?: Partial<Stablepool>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    poolId!: number

    @Index_()
    @StringColumn_({nullable: false})
    poolAddress!: string

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

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number

    @OneToMany_(() => StablepoolAssetData, e => e.pool)
    assets!: StablepoolAssetData[]
}
