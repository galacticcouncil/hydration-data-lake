import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class BatchStableswapHistVolsList {
    constructor(props?: Partial<BatchStableswapHistVolsList>) {
        Object.assign(this, props)
    }

    /**
     * <batchStartParaBlockHeight> (e.g. 101312)
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    poolIds!: (string)[] | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    batchStartParaBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    batchEndParaBlockHeight!: number
}
