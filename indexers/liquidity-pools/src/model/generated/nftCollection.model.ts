import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class NftCollection {
    constructor(props?: Partial<NftCollection>) {
        Object.assign(this, props)
    }

    /**
     * collection ID 
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    collectionType!: string

    @StringColumn_({nullable: false})
    ownerId!: string

    @StringColumn_({nullable: false})
    issuerId!: string

    @StringColumn_({nullable: false})
    adminId!: string

    @StringColumn_({nullable: false})
    freezerId!: string

    @BigIntColumn_({nullable: false})
    totalDeposit!: bigint

    @BooleanColumn_({nullable: false})
    freeHolding!: boolean

    @BooleanColumn_({nullable: false})
    isFrozen!: boolean

    @IntColumn_({nullable: false})
    items!: number

    @IntColumn_({nullable: false})
    itemMetadatas!: number

    @IntColumn_({nullable: false})
    attributes!: number

    @BigIntColumn_({nullable: true})
    maxSupply!: bigint | undefined | null
}
