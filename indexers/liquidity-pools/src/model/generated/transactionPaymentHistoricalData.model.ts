import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Block} from "./block.model"

@Entity_()
export class TransactionPaymentHistoricalData {
    constructor(props?: Partial<TransactionPaymentHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * block_height
     */
    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: true})
    nextFeeMultiplier!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block
}
