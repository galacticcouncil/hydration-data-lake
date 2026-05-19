import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class PendingRedisTsCommit {
  constructor(props?: Partial<PendingRedisTsCommit>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  jobName!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sampleTimestampMs!: bigint

  @Column_("jsonb", {nullable: false})
  payload!: unknown

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date
}
