import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {XykGlobalFarm} from "./xykGlobalFarm.model"
import {Xykpool} from "./xykpool.model"
import {FarmState} from "./_farmState"
import {YieldFarmLoyaltyCurve} from "./_yieldFarmLoyaltyCurve"
import {FarmLifeState} from "./_farmLifeState"
import {Event} from "./event.model"

@Entity_()
export class XykYieldFarm {
  constructor(props?: Partial<XykYieldFarm>) {
    Object.assign(this, props)
  }

  /**
   * yield farm ID
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => XykGlobalFarm, {nullable: true})
  globalFarm!: XykGlobalFarm

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssets!: (string)[]

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  pool!: Xykpool

  @Column_("varchar", {length: 10, nullable: false})
  state!: FarmState

  @Column_("int4", {nullable: false})
  updatedAtRelayBlock!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalValuedShares!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedRpvs!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedRpz!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  multiplier!: bigint

  @Column_("int4", {nullable: false})
  entriesCount!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  leftToDistribute!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalStopped!: bigint

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new YieldFarmLoyaltyCurve(undefined, obj)}, nullable: true})
  loyaltyCurve!: YieldFarmLoyaltyCurve | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (FarmLifeState)[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event | undefined | null
}
