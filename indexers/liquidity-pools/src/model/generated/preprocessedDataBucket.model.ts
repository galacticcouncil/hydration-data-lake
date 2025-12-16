import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, JSONColumn as JSONColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class PreprocessedDataBucket {
    constructor(props?: Partial<PreprocessedDataBucket>) {
        Object.assign(this, props)
    }

    /**
     * <uuid>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    processorId!: string

    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: false})
    entityName!: string

    @JSONColumn_({nullable: false})
    data!: unknown
}
