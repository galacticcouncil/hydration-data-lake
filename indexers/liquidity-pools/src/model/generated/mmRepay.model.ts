import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Event} from "./event.model"

@Entity_()
export class MmRepay {
  constructor(props?: Partial<MmRepay>) {
    Object.assign(this, props)
  }

  /**
   * <event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  repayerAccountId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amount!: bigint | undefined | null

  @Column_("bool", {nullable: true})
  useATokens!: boolean | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
