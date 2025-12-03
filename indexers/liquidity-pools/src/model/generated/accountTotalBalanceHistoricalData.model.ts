import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class AccountTotalBalanceHistoricalData {
    constructor(props?: Partial<AccountTotalBalanceHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <address>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    refAssetId!: string

    @StringColumn_({nullable: false})
    totalTransferableNorm!: string

    @StringColumn_({nullable: false})
    totalLockedNorm!: string

    @StringColumn_({nullable: true})
    totalDebtNorm!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
