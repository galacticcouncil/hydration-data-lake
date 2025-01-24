import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Block} from "./block.model"
import {StableswapLifeState} from "./_stableswapLifeState"
import {StableswapAsset} from "./stableswapAsset.model"

@Entity_()
export class Stableswap {
  constructor(props?: Partial<Stableswap>) {
    Object.assign(this, props)
  }

  /**
   * poolId (e.g. 102)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @Column_("int4", {nullable: false})
  createdAtParaChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  createdAtRelayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  createdAtBlock!: Block

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new StableswapLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (StableswapLifeState)[]

  @OneToMany_(() => StableswapAsset, e => e.pool)
  assets!: StableswapAsset[]
}
