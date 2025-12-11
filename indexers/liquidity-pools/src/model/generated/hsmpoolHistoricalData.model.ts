import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Hsmpool} from "./hsmpool.model"

@Entity_()
export class HsmpoolHistoricalData {
    constructor(props?: Partial<HsmpoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <hsm_collateral_id>-<block_height>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Hsmpool, {nullable: true})
    pool!: Hsmpool

    @BigIntColumn_({nullable: false})
    bucketCapacity!: bigint

    @BigIntColumn_({nullable: false})
    bucketLevel!: bigint

    @Index_()
    @DateTimeColumn_({nullable: false})
    paraTimestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
