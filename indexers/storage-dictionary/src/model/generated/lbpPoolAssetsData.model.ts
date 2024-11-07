import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {LbpPool} from "./lbpPool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class LbpPoolAssetsData {
    constructor(props?: Partial<LbpPoolAssetsData>) {
        Object.assign(this, props)
    }

    /**
     * xykPoolAddress-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LbpPool, {nullable: true})
    pool!: LbpPool

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new AccountBalances(undefined, obj)}, nullable: false})
    balances!: AccountBalances

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
