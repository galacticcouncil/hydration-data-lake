import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {DcaSchedule} from "./dcaSchedule.model"
import {SwapFillerType} from "./_swapFillerType"

@Entity_()
export class DcaScheduleOrderRouteHop {
    constructor(props?: Partial<DcaScheduleOrderRouteHop>) {
        Object.assign(this, props)
    }

    /**
     * <dcaScheduleId>-<assetInId>-<assetOutId>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DcaSchedule, {nullable: true})
    schedule!: DcaSchedule

    @Column_("varchar", {length: 10, nullable: true})
    poolKind!: SwapFillerType | undefined | null

    @StringColumn_({nullable: true})
    assetInId!: string | undefined | null

    @StringColumn_({nullable: true})
    assetOutId!: string | undefined | null
}
