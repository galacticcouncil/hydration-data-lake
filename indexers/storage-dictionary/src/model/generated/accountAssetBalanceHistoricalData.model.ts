import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class AccountAssetBalanceHistoricalData {
  constructor(props?: Partial<AccountAssetBalanceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  accountId!: string

  @Index_()
  @Column_("text", {nullable: false})
  assetId!: string

  /**
   * free property in storage
   */
  @Column_("text", {nullable: false})
  transferable!: string

  /**
   * reserved property in storage
   */
  @Column_("text", {nullable: false})
  totalLocked!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
