import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Omnipool} from "./omnipool.model"
import {OmnipoolAssetLifeState} from "./_omnipoolAssetLifeState"
import {OmnipoolAssetVolumeHistoricalData} from "./omnipoolAssetVolumeHistoricalData.model"
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

  @Column_("text", {nullable: false})
  assetId!: string

  @Index_()
  @Column_("int4", {nullable: false})
  addedAtParaBlockHeight!: number

  @Column_("int4", {nullable: false})
  addedAtRelayBlockHeight!: number

  @Column_("bool", {nullable: true})
  isRemoved!: boolean | undefined | null

  @Column_("text", {nullable: true})
  addedAtBlockId!: string | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new OmnipoolAssetLifeState(undefined, marshal.nonNull(val)))}, nullable: true})
  lifeStates!: (OmnipoolAssetLifeState)[] | undefined | null

  @OneToMany_(() => OmnipoolAssetVolumeHistoricalData, e => e.omnipoolAsset)
  historicalVolume!: OmnipoolAssetVolumeHistoricalData[]

  @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.omnipoolAsset)
  historicalData!: OmnipoolAssetHistoricalData[]
}
