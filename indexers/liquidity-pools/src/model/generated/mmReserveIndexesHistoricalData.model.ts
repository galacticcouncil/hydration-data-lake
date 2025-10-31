import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {MoneyMarketReserve} from "./moneyMarketReserve.model"

@Entity_()
export class MmReserveIndexesHistoricalData {
    constructor(props?: Partial<MmReserveIndexesHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <underlying_asset_address>-<para_block_height>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => MoneyMarketReserve, {nullable: true})
    reserve!: MoneyMarketReserve

    @BigIntColumn_({nullable: true})
    liquidityRate!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    variableBorrowRate!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    liquidityIndex!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    variableBorrowIndex!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
