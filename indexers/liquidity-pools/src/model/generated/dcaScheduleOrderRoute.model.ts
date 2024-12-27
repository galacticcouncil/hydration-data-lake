import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {DcaSchedule} from "./dcaSchedule.model"
import {SwapFillerType} from "./_swapFillerType"
import {Asset} from "./asset.model"

@Entity_()
export class DcaScheduleOrderRoute {
  constructor(props?: Partial<DcaScheduleOrderRoute>) {
    Object.assign(this, props)
  }

  /**
   * <dca_schedule_id>-<asset_in_id>-<asset_out_id>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => DcaSchedule, {nullable: true})
  schedule!: DcaSchedule

  @Column_("varchar", {length: 10, nullable: true})
  poolKind!: SwapFillerType | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetIn!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetOut!: Asset | undefined | null
}
