import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"
import {Asset} from "./asset.model"
import {Account} from "./account.model"

@Entity_()
export class SwapFee {
  constructor(props?: Partial<SwapFee>) {
    Object.assign(this, props)
  }

  /**
   * uuid
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  recipient!: Account
}
