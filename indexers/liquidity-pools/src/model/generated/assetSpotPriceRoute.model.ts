import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class AssetSpotPriceRoute {
  constructor(props?: Partial<AssetSpotPriceRoute>) {
    Object.assign(this, props)
  }

  /**
   * SHA256 hash of the route array
   */
  @PrimaryColumn_()
  id!: string

  @Column_("jsonb", {transformer: {to: obj => obj, from: obj => marshal.fromList(obj, val => marshal.fromList(val, val => marshal.string.fromJSON(val)))}, nullable: false})
  route!: ((string)[])[]

  @Column_("text", {array: true, nullable: false})
  fillerAddresses!: (string)[]

  @Column_("text", {array: true, nullable: false})
  assetPath!: (string)[]

  @Column_("int4", {nullable: false})
  hopCount!: number
}
