import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class SubProcessorStatus {
  constructor(props?: Partial<SubProcessorStatus>) {
    Object.assign(this, props)
  }

  /**
   * sub_processor_schema_name
   */
  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  fromBlock!: number

  @Column_("int4", {nullable: false})
  toBlock!: number

  @Column_("int4", {nullable: false})
  height!: number

  @Column_("int4", {nullable: false})
  assetsActualisedAtBlock!: number
}
