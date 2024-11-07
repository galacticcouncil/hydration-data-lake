import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class SubProcessorStatus {
    constructor(props?: Partial<SubProcessorStatus>) {
        Object.assign(this, props)
    }

    /**
     * sub_processor_schema_name
     */
    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    fromBlock!: number

    @IntColumn_({nullable: false})
    toBlock!: number

    @IntColumn_({nullable: false})
    height!: number
}
