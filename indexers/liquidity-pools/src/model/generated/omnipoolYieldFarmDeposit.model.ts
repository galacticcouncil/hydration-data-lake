import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {OmnipoolYieldFarmEntry} from "./_omnipoolYieldFarmEntry"

@Entity_()
export class OmnipoolYieldFarmDeposit {
  constructor(props?: Partial<OmnipoolYieldFarmDeposit>) {
    Object.assign(this, props)
  }

  /**
   * deposit ID
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  depositNftId!: string

  @Column_("text", {nullable: false})
  globalFarmId!: string

  @Column_("text", {nullable: false})
  yieldFarmId!: string

  @Column_("text", {nullable: false})
  positionId!: string

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  assetId!: string

  /**
   * should be either SharesDeposited or DepositDestroyed
   */
  @Column_("varchar", {length: 17, nullable: false})
  status!: YieldFarmDepositStatus

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sharesAmount!: bigint

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new OmnipoolYieldFarmEntry(undefined, marshal.nonNull(val)))}, nullable: false})
  entries!: (OmnipoolYieldFarmEntry)[]

  @Index_()
  @Column_("int4", {nullable: false})
  createdAtParaBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: true})
  destroyedAtParaBlockHeight!: number | undefined | null
}
