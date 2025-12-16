import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class NftAsset {
    constructor(props?: Partial<NftAsset>) {
        Object.assign(this, props)
    }

    /**
     * <collection_id>-<item_id>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    collectionId!: string

    @StringColumn_({nullable: false})
    ownerId!: string

    @BigIntColumn_({nullable: false})
    deposit!: bigint

    @BooleanColumn_({nullable: false})
    isFrozen!: boolean
}
