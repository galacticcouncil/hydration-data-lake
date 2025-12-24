import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class AssetVolumeHistoricalData {
  constructor(props?: Partial<AssetVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  volumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  volumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalVolumeOut!: bigint

  @Column_("text", {nullable: true})
  volumeInNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  volumeOutNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  totalVolumeInNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  totalVolumeOutNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
