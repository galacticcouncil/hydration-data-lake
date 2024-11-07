import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ProcessorStatus {
    constructor(props?: Partial<ProcessorStatus>) {
        Object.assign(this, props)
    }

    /**
     * 1
     */
    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    assetsActualisedAtBlock!: number

    @DateTimeColumn_({nullable: false})
    initialIndexingStartedAtTime!: Date

    @DateTimeColumn_({nullable: true})
    initialIndexingFinishedAtTime!: Date | undefined | null
}
