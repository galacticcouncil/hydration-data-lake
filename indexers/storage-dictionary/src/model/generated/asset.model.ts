import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AssetType} from "./_assetType"
import {ResourceType} from "./_resourceType"

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

  @Column_("text", {nullable: true})
  evmAddress!: string | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  bondUnderlyingAsset!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  underlyingAsset!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  aToken!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  variableDebtToken!: Asset | undefined | null

  @Column_("varchar", {length: 10, nullable: false})
  assetType!: AssetType

  @Column_("varchar", {length: 10, nullable: true})
  resourceType!: ResourceType | undefined | null

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

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  bondMaturity!: bigint | undefined | null
}
