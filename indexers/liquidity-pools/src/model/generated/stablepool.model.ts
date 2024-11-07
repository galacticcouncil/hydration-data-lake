import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {StablepoolAsset} from "./stablepoolAsset.model"

@Entity_()
export class Stablepool {
    constructor(props?: Partial<Stablepool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtParaBlock!: number

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @IntColumn_({nullable: true})
    destroyedAtParaBlock!: number | undefined | null

    @OneToMany_(() => StablepoolAsset, e => e.pool)
    assets!: StablepoolAsset[]
}
