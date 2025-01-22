import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {DispatchError} from "./_dispatchError"

@Entity_()
export class DcaRandomnessGenerationFailedError {
  constructor(props?: Partial<DcaRandomnessGenerationFailedError>) {
    Object.assign(this, props)
  }

  /**
   * <paraChainBlockHeight>-<indexInBlock>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  operationId!: string | undefined | null

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DispatchError(undefined, obj)}, nullable: true})
  error!: DispatchError | undefined | null
}
