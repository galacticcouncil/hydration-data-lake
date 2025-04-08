import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {XykYieldFarmDeposit} from "./xykYieldFarmDeposit.model"

@Entity_()
export class XykYieldFarmEntry {
  constructor(props?: Partial<XykYieldFarmEntry>) {
    Object.assign(this, props)
  }

  /**
   * <deposit_id>-<xyk_global_farm_id>-<xyk_yield_farm_id>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => XykYieldFarmDeposit, {nullable: true})
  deposit!: XykYieldFarmDeposit

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  valuedShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedRpvs!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedClaimedRewards!: bigint

  @Column_("int4", {nullable: false})
  enteredAtRelayBlock!: number

  @Column_("int4", {nullable: false})
  updatedAtRelayBlock!: number

  @Column_("int4", {nullable: false})
  stoppedAtCreation!: number
}
