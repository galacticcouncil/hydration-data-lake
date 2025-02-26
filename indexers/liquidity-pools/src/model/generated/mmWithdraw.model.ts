import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {Account} from "./account.model"
import {Event} from "./event.model"

@Entity_()
export class MmWithdraw {
  constructor(props?: Partial<MmWithdraw>) {
    Object.assign(this, props)
  }

  /**
   * <event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  accountFrom!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  accountTo!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amount!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
