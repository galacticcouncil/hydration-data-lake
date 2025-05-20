import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {EmaOracleEntry} from "./_emaOracleEntry"

@Entity_()
export class EmaOracle {
  constructor(props?: Partial<EmaOracle>) {
    Object.assign(this, props)
  }

  /**
   * paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new EmaOracleEntry(undefined, marshal.nonNull(val)))}, nullable: false})
  entries!: (EmaOracleEntry)[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
