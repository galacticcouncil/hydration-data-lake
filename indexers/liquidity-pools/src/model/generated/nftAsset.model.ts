import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {NftCollection} from "./nftCollection.model"
import {Account} from "./account.model"

@Entity_()
export class NftAsset {
    constructor(props?: Partial<NftAsset>) {
        Object.assign(this, props)
    }

    /**
     * asset ID 
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => NftCollection, {nullable: true})
    collection!: NftCollection

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @BigIntColumn_({nullable: false})
    deposit!: bigint

    @BooleanColumn_({nullable: false})
    isFrozen!: boolean
}
