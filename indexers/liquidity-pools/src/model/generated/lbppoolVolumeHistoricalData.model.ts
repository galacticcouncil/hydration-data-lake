import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, FloatColumn as FloatColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Lbppool} from "./lbppool.model"
import {Asset} from "./asset.model"

@Entity_()
export class LbppoolVolumeHistoricalData {
    constructor(props?: Partial<LbppoolVolumeHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * PoolId-paraBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Lbppool, {nullable: true})
    pool!: Lbppool

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetA!: Asset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    assetB!: Asset

    @FloatColumn_({nullable: false})
    averagePrice!: number

    @BigIntColumn_({nullable: false})
    assetAVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetAVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetATotalVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetATotalVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetAFeeVol!: bigint

    @BigIntColumn_({nullable: false})
    assetBFeeVol!: bigint

    @BigIntColumn_({nullable: false})
    assetAFeesTotalVol!: bigint

    @BigIntColumn_({nullable: false})
    assetBFeesTotalVol!: bigint

    @BigIntColumn_({nullable: false})
    assetBVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetBVolOut!: bigint

    @BigIntColumn_({nullable: false})
    assetBTotalVolIn!: bigint

    @BigIntColumn_({nullable: false})
    assetBTotalVolOut!: bigint

    @StringColumn_({nullable: false})
    assetAVolInNorm!: string

    @StringColumn_({nullable: false})
    assetAVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetBVolInNorm!: string

    @StringColumn_({nullable: false})
    assetBVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetAFeeVolNorm!: string

    @StringColumn_({nullable: false})
    assetBFeeVolNorm!: string

    @StringColumn_({nullable: false})
    assetATotalVolInNorm!: string

    @StringColumn_({nullable: false})
    assetATotalVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetBTotalVolInNorm!: string

    @StringColumn_({nullable: false})
    assetBTotalVolOutNorm!: string

    @StringColumn_({nullable: false})
    assetAFeesTotalVolNorm!: string

    @StringColumn_({nullable: false})
    assetBFeesTotalVolNorm!: string

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
