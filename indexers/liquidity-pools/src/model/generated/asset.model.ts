import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AssetMultiLocation} from "./_assetMultiLocation"
import {AssetType} from "./_assetType"
import {AssetResourceType} from "./_assetResourceType"

@Entity_()
export class Asset {
  constructor(props?: Partial<Asset>) {
    Object.assign(this, props)
  }

  /**
   * assetRegistry ID or actual contract EVM address (e.g. 0xc64980e4eaf9a1151bd21712b9946b81e41e2b92 || 10)
   */
  @PrimaryColumn_()
  id!: string

  /**
   * Hydration AssetRegistry ID
   */
  @Index_()
  @Column_("text", {nullable: true})
  assetRegistryId!: string | undefined | null

  /**
   * real EVM contract address
   */
  @Column_("text", {nullable: true})
  evmAddress!: string | undefined | null

  /**
   * list of all asset ids from current and other chains related with this Asset
   */
  @Column_("text", {array: true, nullable: true})
  multiLocationIds!: (string | undefined | null)[] | undefined | null

  /**
   * list of all asset multi-locations from current and other chains related with this Asset
   */
  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new AssetMultiLocation(undefined, val))}, nullable: true})
  multiLocationsMetadata!: (AssetMultiLocation | undefined | null)[] | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new AssetMultiLocation(undefined, val))}, nullable: true})
  multiLocations!: (AssetMultiLocation | undefined | null)[] | undefined | null

  @Column_("text", {nullable: true})
  underlyingAssetId!: string | undefined | null

  @Column_("text", {nullable: true})
  aTokenId!: string | undefined | null

  @Column_("text", {nullable: true})
  variableDebtTokenId!: string | undefined | null

  @Column_("text", {nullable: true})
  bondUnderlyingAssetId!: string | undefined | null

  @Column_("varchar", {length: 10, nullable: false})
  assetType!: AssetType

  @Column_("varchar", {length: 10, nullable: false})
  resourceType!: AssetResourceType

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

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  bondMaturity!: bigint | undefined | null
}
