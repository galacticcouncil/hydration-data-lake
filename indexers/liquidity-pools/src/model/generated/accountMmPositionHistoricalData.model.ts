import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

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

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

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
