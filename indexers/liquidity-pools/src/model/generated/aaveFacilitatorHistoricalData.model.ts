import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AaveFacilitator} from "./aaveFacilitator.model"

@Entity_()
export class AaveFacilitatorHistoricalData {
  constructor(props?: Partial<AaveFacilitatorHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <facilitator_h160_address>-<block_height>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => AaveFacilitator, {nullable: true})
  facilitator!: AaveFacilitator

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  bucketCapacity!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  bucketLevel!: bigint

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraTimestamp!: Date

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
