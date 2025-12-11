import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class AccountAssetBalanceLatest {
  constructor(props?: Partial<AccountAssetBalanceLatest>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<assetId>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  accountId!: string

  @Index_()
  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  transferable!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalLocked!: bigint

  @Column_("text", {nullable: true})
  transferableInRefAssetNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  totalLockedInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  total!: bigint

  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
