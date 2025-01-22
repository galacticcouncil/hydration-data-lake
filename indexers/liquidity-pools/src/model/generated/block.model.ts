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
   * 0003396328-000002-70ca4
   */
  @PrimaryColumn_()
  id!: string

  @OneToMany_(() => Extrinsic, e => e.block)
  extrinsics!: Extrinsic[]

  @OneToMany_(() => Call, e => e.block)
  calls!: Call[]

  @OneToMany_(() => Event, e => e.block)
  events!: Event[]

  @OneToMany_(() => ChainActivityTrace, e => e.createdAtBlock)
  chainActivityTraces!: ChainActivityTrace[]

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("text", {nullable: false})
  paraChainBlockHash!: string

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraChainBlockTimestamp!: Date
}
