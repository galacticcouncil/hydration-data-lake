import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class AccountOwnedAsset {
  constructor(props?: Partial<AccountOwnedAsset>) {
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

  @Column_("int4", {nullable: false})
  firstSeenParaBlockHeight!: number
}
