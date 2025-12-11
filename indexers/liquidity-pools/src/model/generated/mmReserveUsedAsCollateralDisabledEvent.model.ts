import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"

@Entity_()
export class MmReserveUsedAsCollateralDisabledEvent {
    constructor(props?: Partial<MmReserveUsedAsCollateralDisabledEvent>) {
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
    accountId!: string

    @StringColumn_({nullable: false})
    assetId!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
