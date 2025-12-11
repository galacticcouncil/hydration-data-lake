import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

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

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    issuer!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    admin!: Account

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    freezer!: Account

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
