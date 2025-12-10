import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: false})
    accountId!: string

    @BigIntColumn_({nullable: true})
    debtToCoverAmount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    liquidatedCollateralAmount!: bigint | undefined | null

    @StringColumn_({nullable: false})
    liquidatorAccountId!: string

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
