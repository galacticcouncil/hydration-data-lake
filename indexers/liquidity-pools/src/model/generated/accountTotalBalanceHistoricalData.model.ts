import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Asset} from "./asset.model"

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

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    refAsset!: Asset

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
}
