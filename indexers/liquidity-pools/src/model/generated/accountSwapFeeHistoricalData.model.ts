import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {AccountAssetSwapFeeHistoricalData} from "./accountAssetSwapFeeHistoricalData.model"

@Entity_()
export class AccountSwapFeeHistoricalData {
    constructor(props?: Partial<AccountSwapFeeHistoricalData>) {
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

    @OneToMany_(() => AccountAssetSwapFeeHistoricalData, e => e.collection)
    fees!: AccountAssetSwapFeeHistoricalData[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
