import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class AccountTotalBalanceHistoricalDataLog {
  constructor(props?: Partial<AccountTotalBalanceHistoricalDataLog>) {
    Object.assign(this, props)
  }

  /**
   * uuid
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("text", {nullable: false})
  source!: string

  @Column_("text", {nullable: true})
  memo!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  transferable!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalLocked!: bigint | undefined | null

  @Column_("text", {nullable: true})
  transferableNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  totalLockedNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
