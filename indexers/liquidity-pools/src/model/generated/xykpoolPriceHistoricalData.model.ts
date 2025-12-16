import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Xykpool} from "./xykpool.model"

@Entity_()
export class XykpoolPriceHistoricalData {
    constructor(props?: Partial<XykpoolPriceHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * PoolId-paraBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Xykpool, {nullable: true})
    pool!: Xykpool

    @StringColumn_({nullable: false})
    assetAId!: string

    @StringColumn_({nullable: false})
    assetBId!: string

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
