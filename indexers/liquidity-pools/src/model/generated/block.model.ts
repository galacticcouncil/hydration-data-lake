import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Extrinsic} from "./extrinsic.model"
import {Call} from "./call.model"
import {Event} from "./event.model"
import {ChainActivityTrace} from "./chainActivityTrace.model"

@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    /**
     * <blockHeight>-<blockHash prefix> e.g. 0003396328-70ca4
     */
    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Extrinsic, e => e.block)
    extrinsics!: Extrinsic[]

    @OneToMany_(() => Call, e => e.block)
    calls!: Call[]

    @OneToMany_(() => Event, e => e.block)
    events!: Event[]

    @OneToMany_(() => ChainActivityTrace, e => e.block)
    chainActivityTraces!: ChainActivityTrace[]

    @Index_()
    @IntColumn_({nullable: false})
    height!: number

    @Index_()
    @StringColumn_({nullable: false})
    hash!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
