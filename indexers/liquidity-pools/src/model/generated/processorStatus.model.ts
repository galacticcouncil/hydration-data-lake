import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ProcessorStatus {
  constructor(props?: Partial<ProcessorStatus>) {
    Object.assign(this, props)
  }

  /**
   * static value - 1
   */
  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  assetsLastUpdatedAtBlock!: number

  @Column_("int4", {nullable: true})
  poolsDestroyedUpdatedAtBlock!: number | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  initialIndexingStartedAt!: Date

  @Column_("timestamp with time zone", {nullable: true})
  initialIndexingFinishedAt!: Date | undefined | null
}
