import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"

@Entity_()
export class AccountAssetBalanceData {
  constructor(props?: Partial<AccountAssetBalanceData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<assetId>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  decoratedFree!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  decoratedLocked!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  free!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  locked!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  flags!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  frozen!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  reserved!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  feeFrozen!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  miscFrozen!: bigint
}
