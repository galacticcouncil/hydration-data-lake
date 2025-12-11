import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {TraceEntityType} from "./_traceEntityType"
import {Event} from "./event.model"
import {Block} from "./block.model"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class Call {
    constructor(props?: Partial<Call>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    traceId!: string

    @StringColumn_({nullable: true})
    args!: string | undefined | null

    @BooleanColumn_({nullable: true})
    success!: boolean | undefined | null

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    originKind!: string

    @StringColumn_({nullable: true})
    originValueKind!: string | undefined | null

    @StringColumn_({nullable: true})
    originValue!: string | undefined | null

    @Column_("varchar", {length: 25, array: true, nullable: true})
    entityTypes!: (TraceEntityType | undefined | null)[] | undefined | null

    @OneToMany_(() => Call, e => e.parent)
    subcalls!: Call[]

    @OneToMany_(() => Event, e => e.call)
    events!: Event[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Index_()
    @ManyToOne_(() => Extrinsic, {nullable: true})
    extrinsic!: Extrinsic

    @Index_()
    @ManyToOne_(() => Call, {nullable: true})
    parent!: Call | undefined | null
}
