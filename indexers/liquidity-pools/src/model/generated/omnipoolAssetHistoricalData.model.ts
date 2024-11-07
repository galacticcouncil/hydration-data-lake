import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {Asset} from "./asset.model"

@Entity_()
export class OmnipoolAssetHistoricalData {
    constructor(props?: Partial<OmnipoolAssetHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * OmnipoolAssetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @BigIntColumn_({nullable: false})
    stateCap!: bigint

    @BigIntColumn_({nullable: false})
    stateShares!: bigint

    @BigIntColumn_({nullable: false})
    stateHubReserve!: bigint

    @BigIntColumn_({nullable: false})
    stateProtocolShares!: bigint

    @BigIntColumn_({nullable: false})
    balanceFree!: bigint

    @BigIntColumn_({nullable: false})
    balanceFlags!: bigint

    @BigIntColumn_({nullable: false})
    balanceFrozen!: bigint

    @BigIntColumn_({nullable: false})
    balanceReserved!: bigint

    @BigIntColumn_({nullable: false})
    balanceFeeFrozen!: bigint

    @BigIntColumn_({nullable: false})
    balanceMiscFrozen!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
