import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: false})
    accountId!: string

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
