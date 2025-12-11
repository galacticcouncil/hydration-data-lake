import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ProcessorStatus {
    constructor(props?: Partial<ProcessorStatus>) {
        Object.assign(this, props)
    }

    /**
     * processor state schema name
     */
    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    assetsLastUpdatedAtBlock!: number

    @IntColumn_({nullable: true})
    poolsDestroyedUpdatedAtBlock!: number | undefined | null

    @DateTimeColumn_({nullable: false})
    initialIndexingStartedAt!: Date

    @DateTimeColumn_({nullable: true})
    initialIndexingFinishedAt!: Date | undefined | null

    @IntColumn_({nullable: false})
    latestProcessedBlock!: number

    @IntColumn_({nullable: true})
    stableswapHistDataLatestBlock!: number | undefined | null

    @IntColumn_({nullable: true})
    omnipoolHistDataLatestBlock!: number | undefined | null

    @IntColumn_({nullable: true})
    xykpoolHistDataLatestBlock!: number | undefined | null

    @IntColumn_({nullable: true})
    aavepoolHistDataLatestBlock!: number | undefined | null
}
