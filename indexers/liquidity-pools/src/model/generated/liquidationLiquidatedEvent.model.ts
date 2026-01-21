import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Event} from "./event.model"

@Entity_()
export class LiquidationLiquidatedEvent {
  constructor(props?: Partial<LiquidationLiquidatedEvent>) {
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
  accountId!: string

  @Column_("text", {nullable: false})
  collateralAssetId!: string

  @Column_("text", {nullable: false})
  debtAssetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  profit!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
