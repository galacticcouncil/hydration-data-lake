import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Event} from "./event.model"

@Entity_()
export class MmLiquidationCall {
    constructor(props?: Partial<MmLiquidationCall>) {
        Object.assign(this, props)
    }

    /**
     * <event_id>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @StringColumn_({nullable: false})
    collateralAssetId!: string

    @StringColumn_({nullable: false})
    debtAssetId!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @BigIntColumn_({nullable: true})
    debtToCoverAmount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    liquidatedCollateralAmount!: bigint | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    liquidatorAccount!: Account

    @BooleanColumn_({nullable: false})
    receiveAToken!: boolean

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
