import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {StablepoolHistoricalData} from "./stablepoolHistoricalData.model"

@Entity_()
export class StablepoolAssetHistoricalData {
  constructor(props?: Partial<StablepoolAssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Index_()
  @ManyToOne_(() => StablepoolHistoricalData, {nullable: true})
  poolHistoricalData!: StablepoolHistoricalData

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  free!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  reserved!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  miscFrozen!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  feeFrozen!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  frozen!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  flags!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
