import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {HsmCollateral} from "./hsmCollateral.model"
import {AaveFacilitatorHistoricalData} from "./aaveFacilitatorHistoricalData.model"

@Entity_()
export class HsmpoolAssetHistoricalData {
  constructor(props?: Partial<HsmpoolAssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <asset_id>-<block_height>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  /**
   * Can be null if snapshot is for Hollar
   */
  @Index_()
  @ManyToOne_(() => HsmCollateral, {nullable: true})
  collateral!: HsmCollateral | undefined | null

  /**
   * Actual only for Hollar asset as Hsm pool doesn't have any balance of Hollar
   */
  @Index_()
  @ManyToOne_(() => AaveFacilitatorHistoricalData, {nullable: true})
  facilitatorHistData!: AaveFacilitatorHistoricalData | undefined | null

  /**
   * Can be 0 for Hollar as HSM pool 
   */
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  freeBalance!: bigint

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetFeeVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalFeesVol!: bigint

  @Column_("text", {nullable: false})
  assetVolInNorm!: string

  @Column_("text", {nullable: false})
  assetVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetFeeVolNorm!: string

  @Column_("text", {nullable: false})
  assetTotalVolInNorm!: string

  @Column_("text", {nullable: false})
  assetTotalVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetTotalFeesVolNorm!: string

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraTimestamp!: Date

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
