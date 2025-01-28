import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
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
  @Column_("int4", {nullable: false})
  height!: number

  @Index_()
  @Column_("text", {nullable: false})
  hash!: string

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number
}
