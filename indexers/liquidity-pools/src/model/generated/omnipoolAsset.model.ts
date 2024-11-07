import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"
import {Omnipool} from "./omnipool.model"
import {OmnipoolAssetHistoricalVolume} from "./omnipoolAssetHistoricalVolume.model"
import {OmnipoolAssetHistoricalData} from "./omnipoolAssetHistoricalData.model"
import {OmnipoolAssetOperation} from "./omnipoolAssetOperation.model"

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

    @BigIntColumn_({nullable: false})
    initialAmount!: bigint

    @BigIntColumn_({nullable: false})
    initialPrice!: bigint

    @Index_()
    @ManyToOne_(() => Omnipool, {nullable: true})
    pool!: Omnipool

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtParaBlock!: number

    @BooleanColumn_({nullable: true})
    isRemoved!: boolean | undefined | null

    @IntColumn_({nullable: true})
    removedAtParaBlock!: number | undefined | null

    @BigIntColumn_({nullable: true})
    removedAmount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    hubWithdrawn!: bigint | undefined | null

    @OneToMany_(() => OmnipoolAssetHistoricalVolume, e => e.omnipoolAsset)
    historicalVolume!: OmnipoolAssetHistoricalVolume[]

    @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.omnipoolAsset)
    historicalData!: OmnipoolAssetHistoricalData[]

    @OneToMany_(() => OmnipoolAssetOperation, e => e.assetIn)
    operationsIn!: OmnipoolAssetOperation[]

    @OneToMany_(() => OmnipoolAssetOperation, e => e.assetOut)
    operationsOut!: OmnipoolAssetOperation[]
}
