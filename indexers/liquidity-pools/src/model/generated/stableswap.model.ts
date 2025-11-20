import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {StableswapLifeState} from "./_stableswapLifeState"
import {StableswapAsset} from "./stableswapAsset.model"

@Entity_()
export class Stableswap {
    constructor(props?: Partial<Stableswap>) {
        Object.assign(this, props)
    }

    /**
     * poolId - share token ID (e.g. 102)
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @StringColumn_({nullable: false})
    shareTokenId!: string

    @Index_()
    @IntColumn_({nullable: false})
    createdAtParaBlockHeight!: number

    @IntColumn_({nullable: false})
    createdAtRelayBlockHeight!: number

    @StringColumn_({nullable: true})
    createdAtBlockId!: string | undefined | null

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new StableswapLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
    lifeStates!: (StableswapLifeState)[]

    @OneToMany_(() => StableswapAsset, e => e.pool)
    assets!: StableswapAsset[]
}
