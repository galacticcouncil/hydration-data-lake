import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Aavepool} from "./aavepool.model"

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

    @StringColumn_({nullable: true})
    reserveAssetId!: string | undefined | null

    @StringColumn_({nullable: true})
    reserveAssetRegistryId!: string | undefined | null

    @StringColumn_({nullable: false})
    aTokenId!: string

    @StringColumn_({nullable: false})
    aTokenRegistryId!: string

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
}
