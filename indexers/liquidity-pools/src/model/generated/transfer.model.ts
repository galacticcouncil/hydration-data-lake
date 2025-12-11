import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {AssetType} from "./_assetType"
import {Event} from "./event.model"

@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
    Object.assign(this, props)
  }

  /**
   * <eventId> (e.g. 0000059948-e5832-000007)
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("varchar", {length: 10, nullable: false})
  assetType!: AssetType

  @Column_("text", {nullable: false})
  fromId!: string

  @Column_("text", {nullable: false})
  toId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  txFee!: bigint

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraTimestamp!: Date

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
