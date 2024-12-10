import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Trade} from "./trade.model"
import {Account} from "./account.model"
import {SwapFillerType} from "./_swapFillerType"
import {TradeOperationType} from "./_tradeOperationType"
import {SwapFee} from "./swapFee.model"
import {SwapInputAssetBalance} from "./swapInputAssetBalance.model"
import {SwapOutputAssetBalance} from "./swapOutputAssetBalance.model"

@Entity_()
export class Swap {
  constructor(props?: Partial<Swap>) {
    Object.assign(this, props)
  }

  /**
   * indexer event_id (e.g. <block_number>-<block_hash_partial>-<event_index> 0006516718-9965d-000107)
   */
  @PrimaryColumn_()
  id!: string

  /**
   * Swapped event index within Trade events sequence
   */
  @Index_()
  @Column_("int4", {nullable: false})
  swapIndex!: number

  @Index_()
  @ManyToOne_(() => Trade, {nullable: true})
  trade!: Trade

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  swapper!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  filler!: Account

  @Column_("varchar", {length: 10, nullable: false})
  fillerType!: SwapFillerType

  @Column_("varchar", {length: 15, nullable: false})
  operationType!: TradeOperationType

  @OneToMany_(() => SwapFee, e => e.swap)
  fees!: SwapFee[]

  @OneToMany_(() => SwapInputAssetBalance, e => e.swap)
  inputs!: SwapInputAssetBalance[]

  @OneToMany_(() => SwapOutputAssetBalance, e => e.swap)
  outputs!: SwapOutputAssetBalance[]

  /**
   * actual for fillerType: Omnipool
   */
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  hubAmountIn!: bigint | undefined | null

  /**
   * actual for fillerType: Omnipool
   */
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  hubAmountOut!: bigint | undefined | null

  @Column_("int4", {nullable: false})
  eventIndex!: number

  @Column_("text", {nullable: false})
  extrinsicHash!: string

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraChainTimestamp!: Date
}
