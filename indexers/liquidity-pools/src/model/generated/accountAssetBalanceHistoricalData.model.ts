import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

@Entity_()
export class AccountAssetBalanceHistoricalData {
    constructor(props?: Partial<AccountAssetBalanceHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <address>-<assetId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @StringColumn_({nullable: false})
    assetId!: string

    /**
     * free property in storage
     */
    @BigIntColumn_({nullable: false})
    transferable!: bigint

    /**
     * reserved property in storage
     */
    @BigIntColumn_({nullable: false})
    totalLocked!: bigint

    @StringColumn_({nullable: true})
    transferableInRefAssetNorm!: string | undefined | null

    @StringColumn_({nullable: true})
    totalLockedInRefAssetNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
