import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {XykPool} from "./xykPool.model"
import {AccountBalances} from "./_accountBalances"

@Entity_()
export class XykPoolAssetsData {
    constructor(props?: Partial<XykPoolAssetsData>) {
        Object.assign(this, props)
    }

    /**
     * xykPoolAddress-assetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => XykPool, {nullable: true})
    pool!: XykPool

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new AccountBalances(undefined, obj)}, nullable: false})
    balances!: AccountBalances

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
