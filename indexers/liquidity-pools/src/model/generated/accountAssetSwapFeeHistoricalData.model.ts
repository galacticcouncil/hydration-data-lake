import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {AccountSwapFeeHistoricalData} from "./accountSwapFeeHistoricalData.model"
import {Account} from "./account.model"

@Entity_()
export class AccountAssetSwapFeeHistoricalData {
    constructor(props?: Partial<AccountAssetSwapFeeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <historicalAccountSwapFeeId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => AccountSwapFeeHistoricalData, {nullable: true})
    collection!: AccountSwapFeeHistoricalData

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @StringColumn_({nullable: false})
    assetId!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    totalAmount!: bigint

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
