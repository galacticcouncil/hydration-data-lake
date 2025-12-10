import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class Omnipool {
    constructor(props?: Partial<Omnipool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @IntColumn_({nullable: true})
    destroyedAtParaBlockHeight!: number | undefined | null

    @OneToMany_(() => OmnipoolAsset, e => e.pool)
    assets!: OmnipoolAsset[]
}
