import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Swap} from "./swap.model"
import {Stablepool} from "./stablepool.model"
import {Asset} from "./asset.model"
import {OtcOrder} from "./otcOrder.model"

@Entity_()
export class SwapFillerContext {
  constructor(props?: Partial<SwapFillerContext>) {
    Object.assign(this, props)
  }

  /**
   * swap_id
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Index_()
  @ManyToOne_(() => Stablepool, {nullable: true})
  stablepool!: Stablepool | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  shareToken!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => OtcOrder, {nullable: true})
  otcOrder!: OtcOrder | undefined | null
}
