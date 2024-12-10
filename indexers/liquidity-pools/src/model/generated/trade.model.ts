import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {Swap} from "./swap.model"

@Entity_()
export class Trade {
  constructor(props?: Partial<Trade>) {
    Object.assign(this, props)
  }

  /**
   * uuid
   */
  @PrimaryColumn_()
  id!: string

  /**
   * Swapper account picked up from first Swapped event in Trade hops sequence
   */
  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  initiator!: Account

  @Index_()
  @Column_("int4", {nullable: true})
  routerOperationId!: number | undefined | null

  @Index_()
  @Column_("int4", {nullable: true})
  batchOperationId!: number | undefined | null

  @Index_()
  @Column_("int4", {nullable: true})
  dcaOperationId!: number | undefined | null

  @Index_()
  @Column_("int4", {nullable: true})
  iceOperationId!: number | undefined | null

  @OneToMany_(() => Swap, e => e.trade)
  swaps!: Swap[]
}
