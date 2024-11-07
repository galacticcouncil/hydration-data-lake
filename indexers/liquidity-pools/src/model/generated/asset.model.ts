import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {AssetType} from "./_assetType"

@Entity_()
export class Asset {
    constructor(props?: Partial<Asset>) {
        Object.assign(this, props)
    }

    /**
     * Asset ID
     */
    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 10, nullable: false})
    assetType!: AssetType

    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    symbol!: string | undefined | null

    @IntColumn_({nullable: true})
    decimals!: number | undefined | null

    @BigIntColumn_({nullable: true})
    xcmRateLimit!: bigint | undefined | null

    @BooleanColumn_({nullable: false})
    isSufficient!: boolean

    @BigIntColumn_({nullable: false})
    existentialDeposit!: bigint
}
