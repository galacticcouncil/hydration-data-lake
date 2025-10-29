import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {Omnipool} from "./omnipool.model"
import {Asset} from "./asset.model"
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

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Index_()
    @IntColumn_({nullable: false})
    addedAtParaBlockHeight!: number

    @IntColumn_({nullable: false})
    addedAtRelayBlockHeight!: number

    @BooleanColumn_({nullable: true})
    isRemoved!: boolean | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new OmnipoolAssetLifeState(undefined, marshal.nonNull(val)))}, nullable: true})
    lifeStates!: (OmnipoolAssetLifeState)[] | undefined | null

    @OneToMany_(() => OmnipoolAssetVolumeHistoricalData, e => e.omnipoolAsset)
    historicalVolume!: OmnipoolAssetVolumeHistoricalData[]

    @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.omnipoolAsset)
    historicalData!: OmnipoolAssetHistoricalData[]
}
