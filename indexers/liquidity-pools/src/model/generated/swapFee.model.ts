import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Swap} from "./swap.model"
import {SwapFeeDestinationType} from "./_swapFeeDestinationType"

@Entity_()
export class SwapFee {
    constructor(props?: Partial<SwapFee>) {
        Object.assign(this, props)
    }

    /**
     * <swapId>-<assetId>-<recipientId || destinationType> e.g. 0006516718-9965d-000107-0
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Swap, {nullable: true})
    swap!: Swap

    @StringColumn_({nullable: false})
    assetId!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @Column_("varchar", {length: 7, nullable: false})
    destinationType!: SwapFeeDestinationType

    @StringColumn_({nullable: true})
    recipientId!: string | undefined | null
}
