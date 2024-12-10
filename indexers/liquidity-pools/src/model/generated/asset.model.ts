import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {AssetType} from "./_assetType"

@Entity_()
export class Asset {
  constructor(props?: Partial<Asset>) {
    Object.assign(this, props)
  }

  /**
   * Asset ID
   */
  @PrimaryColumn_()
  id!: string

  @Column_("varchar", {length: 10, nullable: false})
  assetType!: AssetType

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  symbol!: string | undefined | null

  @Column_("int4", {nullable: true})
  decimals!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  xcmRateLimit!: bigint | undefined | null

  @Column_("bool", {nullable: false})
  isSufficient!: boolean

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  existentialDeposit!: bigint
}
