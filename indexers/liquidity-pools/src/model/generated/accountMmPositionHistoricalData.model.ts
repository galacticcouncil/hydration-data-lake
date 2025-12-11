import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class AccountMmPositionHistoricalData {
    constructor(props?: Partial<AccountMmPositionHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <address>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: true})
    accountBoundEvmAddress!: string | undefined | null

    @StringColumn_({nullable: false})
    totalCollateralBase!: string

    @StringColumn_({nullable: false})
    totalDebtBase!: string

    @StringColumn_({nullable: false})
    availableBorrowsBase!: string

    @StringColumn_({nullable: false})
    currentLiquidationThreshold!: string

    @StringColumn_({nullable: false})
    ltv!: string

    @StringColumn_({nullable: true})
    healthFactor!: string | undefined | null

    @StringColumn_({nullable: false})
    poolAddress!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
