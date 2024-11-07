import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {AccountBalances} from "./_accountBalances"
import {OmnipoolAssetState} from "./_omnipoolAssetState"

@Entity_()
export class OmnipoolAssetData {
    constructor(props?: Partial<OmnipoolAssetData>) {
        Object.assign(this, props)
    }

    /**
     * omnipooAddress-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    poolAddress!: string

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new AccountBalances(undefined, obj)}, nullable: false})
    balances!: AccountBalances

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new OmnipoolAssetState(undefined, obj)}, nullable: false})
    assetState!: OmnipoolAssetState

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
