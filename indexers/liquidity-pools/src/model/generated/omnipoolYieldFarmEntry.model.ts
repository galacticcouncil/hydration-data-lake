import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolYieldFarmDeposit} from "./omnipoolYieldFarmDeposit.model"

@Entity_()
export class OmnipoolYieldFarmEntry {
  constructor(props?: Partial<OmnipoolYieldFarmEntry>) {
    Object.assign(this, props)
  }

  /**
   * <deposit_id>-<omnipool_global_farm_id>-<omnipool_yield_farm_id>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolYieldFarmDeposit, {nullable: true})
  deposit!: OmnipoolYieldFarmDeposit

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
