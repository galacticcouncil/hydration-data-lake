import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Aavepool} from "./aavepool.model"
import {Asset} from "./asset.model"

@Entity_()
export class AavepoolHistoricalData {
    constructor(props?: Partial<AavepoolHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <aavepoolId>-<paraBlockHeight>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Aavepool, {nullable: true})
    pool!: Aavepool

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    reserveAsset!: Asset | undefined | null

    @StringColumn_({nullable: true})
    reserveAssetRegistryId!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    aToken!: Asset | undefined | null

    @StringColumn_({nullable: true})
    aTokenRegistryId!: string | undefined | null

    @BigIntColumn_({nullable: false})
    liquidityIn!: bigint

    @BigIntColumn_({nullable: false})
    liquidityOut!: bigint

    /**
     * Ref asset value of liquidityIn property - what actual amount of collateral is locked in pool 
     */
    @StringColumn_({nullable: true})
    tvlInRefAssetNorm!: string | undefined | null

    @BigIntColumn_({nullable: true})
    aTokenTotalSupply!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    variableDebtTokenTotalSupply!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @StringColumn_({nullable: true})
    blockId!: string | undefined | null
}
