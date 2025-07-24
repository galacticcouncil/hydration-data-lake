import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {AccountType} from "./_accountType"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  /**
   * <address>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("varchar", {length: 10, nullable: false})
  accountType!: AccountType

  @Column_("text", {nullable: true})
  boundEvmAddress!: string | undefined | null
}
