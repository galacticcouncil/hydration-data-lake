import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {HistoricalAccountAssetSwapFee} from "./historicalAccountAssetSwapFee.model"
import {Block} from "./block.model"

@Entity_()
export class HistoricalAccountSwapFee {
  constructor(props?: Partial<HistoricalAccountSwapFee>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @OneToMany_(() => HistoricalAccountAssetSwapFee, e => e.collection)
  fees!: HistoricalAccountAssetSwapFee[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
