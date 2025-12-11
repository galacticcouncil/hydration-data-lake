import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {EmaOraclePeriod} from "./_emaOraclePeriod"

@Entity_()
export class EmaOracleEntryHistoricalData {
  constructor(props?: Partial<EmaOracleEntryHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <paraBlockHeight>-<assetAId>-<assetBId>-<source>-<period>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  assetAId!: string

  @Column_("text", {nullable: false})
  assetBId!: string

  @Column_("text", {nullable: false})
  assetAAssetRegistryId!: string

  @Column_("text", {nullable: false})
  assetBAssetRegistryId!: string

  @Index_()
  @Column_("text", {nullable: false})
  source!: string

  @Column_("varchar", {length: 10, nullable: false})
  period!: EmaOraclePeriod

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  numeratorPrice!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  denominatorPrice!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAInVolume!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAOutVolume!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBInVolume!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBOutVolume!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetALiquidity!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBLiquidity!: bigint

  @Column_("int4", {nullable: false})
  updatedAtParaBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
