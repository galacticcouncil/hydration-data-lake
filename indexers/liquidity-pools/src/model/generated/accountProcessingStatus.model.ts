import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class AccountProcessingStatus {
  constructor(props?: Partial<AccountProcessingStatus>) {
    Object.assign(this, props)
  }

  /**
   * <account_address>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: true})
  mmReserveBalancesInitializedAtParaBlock!: number | undefined | null

  @Column_("int4", {nullable: true})
  balancesAggregatedAtParaBlock!: number | undefined | null
}
