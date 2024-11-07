import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {XykPoolAssetsData} from "./xykPoolAssetsData.model"

@Entity_()
export class XykPool {
    constructor(props?: Partial<XykPool>) {
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

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number

    @OneToMany_(() => XykPoolAssetsData, e => e.pool)
    assets!: XykPoolAssetsData[]
}
