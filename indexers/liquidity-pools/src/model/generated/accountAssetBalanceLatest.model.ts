import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AccountAssetBalanceLatest {
    constructor(props?: Partial<AccountAssetBalanceLatest>) {
        Object.assign(this, props)
    }

    /**
     * <address>-<assetId>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    accountId!: string

    @Index_()
    @StringColumn_({nullable: false})
    assetId!: string

    @BigIntColumn_({nullable: false})
    transferable!: bigint

    @BigIntColumn_({nullable: false})
    totalLocked!: bigint

    @StringColumn_({nullable: true})
    transferableInRefAssetNorm!: string | undefined | null

    @StringColumn_({nullable: true})
    totalLockedInRefAssetNorm!: string | undefined | null

    @Index_()
    @BigIntColumn_({nullable: false})
    total!: bigint

    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
