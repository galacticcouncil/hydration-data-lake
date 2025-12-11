import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_} from "typeorm"
import {RoutedTradeAssetBalance} from "./routedTradeAssetBalance.model"
import {Swap} from "./swap.model"

@Entity_()
export class RoutedTrade {
  constructor(props?: Partial<RoutedTrade>) {
    Object.assign(this, props)
  }

  /**
   * <blockHeight>-<routerIncrementalId || swapId> (e.g. 6516718-3094 || 6516718-0006516718-9965d-000107)
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  routeId!: string | undefined | null

  @OneToMany_(() => RoutedTradeAssetBalance, e => e.routedTrade)
  inputs!: RoutedTradeAssetBalance[]

  @OneToMany_(() => RoutedTradeAssetBalance, e => e.routedTrade)
  outputs!: RoutedTradeAssetBalance[]

  @Column_("text", {array: true, nullable: false})
  inputAssetIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  inputAssetRegistryIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  outputAssetIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  outputAssetRegistryIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetRegistryIds!: (string)[]

  @Column_("text", {array: true, nullable: false})
  participantSwappers!: (string)[]

  @Column_("text", {array: true, nullable: false})
  participantFillers!: (string)[]

  @Column_("text", {array: true, nullable: false})
  feeRecipients!: (string)[]

  @OneToMany_(() => Swap, e => e.routedTrade)
  swaps!: Swap[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
