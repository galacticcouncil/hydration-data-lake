import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {Omnipool} from "./omnipool.model"
import {OmnipoolAssetHistoricalVolume} from "./omnipoolAssetHistoricalVolume.model"
import {OmnipoolAssetHistoricalData} from "./omnipoolAssetHistoricalData.model"

@Entity_()
export class OmnipoolAsset {
  constructor(props?: Partial<OmnipoolAsset>) {
    Object.assign(this, props)
  }

  /**
   * OmnipoolId-AssetId
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  initialAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  initialPrice!: bigint

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  pool!: Omnipool

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("int4", {nullable: false})
  createdAtParaBlock!: number

  @Column_("bool", {nullable: true})
  isRemoved!: boolean | undefined | null

  @Column_("int4", {nullable: true})
  removedAtParaBlock!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  removedAmount!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  hubWithdrawn!: bigint | undefined | null

  @OneToMany_(() => OmnipoolAssetHistoricalVolume, e => e.omnipoolAsset)
  historicalVolume!: OmnipoolAssetHistoricalVolume[]

  @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.omnipoolAsset)
  historicalData!: OmnipoolAssetHistoricalData[]
}
