import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ProcessorStatus {
  constructor(props?: Partial<ProcessorStatus>) {
    Object.assign(this, props)
  }

  /**
   * 1
   */
  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  assetsActualisedAtBlock!: number

  @Column_("int4", {nullable: true})
  poolsDestroyedCheckPointAtBlock!: number | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  initialIndexingStartedAtTime!: Date

  @Column_("timestamp with time zone", {nullable: true})
  initialIndexingFinishedAtTime!: Date | undefined | null
}
