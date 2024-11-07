import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Stablepool} from "./stablepool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class StablepoolAssetData {
    constructor(props?: Partial<StablepoolAssetData>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @IntColumn_({nullable: false})
    assetId!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new AccountBalances(undefined, obj)}, nullable: false})
    balances!: AccountBalances

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
