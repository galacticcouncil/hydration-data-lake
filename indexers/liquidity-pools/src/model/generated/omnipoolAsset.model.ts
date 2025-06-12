import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Omnipool} from "./omnipool.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"
import {OmnipoolAssetLifeState} from "./_omnipoolAssetLifeState"
import {OmnipoolAssetHistoricalVolume} from "./omnipoolAssetHistoricalVolume.model"
import {OmnipoolAssetHistoricalData} from "./omnipoolAssetHistoricalData.model"

@Entity_()
export class OmnipoolAsset {
  constructor(props?: Partial<OmnipoolAsset>) {
    Object.assign(this, props)
  }

  /**
   * <omnipoolId>-<assetId> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-100)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  pool!: Omnipool

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Index_()
  @Column_("int4", {nullable: false})
  addedAtParaBlockHeight!: number

  @Column_("int4", {nullable: false})
  addedAtRelayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  addedAtBlock!: Block

  @Column_("bool", {nullable: true})
  isRemoved!: boolean | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new OmnipoolAssetLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (OmnipoolAssetLifeState)[]

  @OneToMany_(() => OmnipoolAssetHistoricalVolume, e => e.omnipoolAsset)
  historicalVolume!: OmnipoolAssetHistoricalVolume[]

  @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.omnipoolAsset)
  historicalData!: OmnipoolAssetHistoricalData[]
}
