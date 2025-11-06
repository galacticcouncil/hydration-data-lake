import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {AssetMultiLocation} from "./_assetMultiLocation"
import {AssetType} from "./_assetType"
import {ResourceType} from "./_resourceType"

@Entity_()
export class Asset {
    constructor(props?: Partial<Asset>) {
        Object.assign(this, props)
    }

    /**
     * assetRegistry ID or actual contract EVM address (e.g. 0xc64980e4eaf9a1151bd21712b9946b81e41e2b92 || 10)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Hydration AssetRegistry ID
     */
    @Index_()
    @StringColumn_({nullable: true})
    assetRegistryId!: string | undefined | null

    /**
     * real EVM contract address
     */
    @StringColumn_({nullable: true})
    evmAddress!: string | undefined | null

    /**
     * list of all asset ids from current and other chains related with this Asset
     */
    @StringColumn_({array: true, nullable: true})
    multiLocationIds!: (string | undefined | null)[] | undefined | null

    /**
     * list of all asset multi-locations from current and other chains related with this Asset
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new AssetMultiLocation(undefined, val))}, nullable: true})
    multiLocationsMetadata!: (AssetMultiLocation | undefined | null)[] | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new AssetMultiLocation(undefined, val))}, nullable: true})
    multiLocations!: (AssetMultiLocation | undefined | null)[] | undefined | null

    @StringColumn_({nullable: true})
    underlyingAssetId!: string | undefined | null

    @StringColumn_({nullable: true})
    aTokenId!: string | undefined | null

    @StringColumn_({nullable: true})
    variableDebtTokenId!: string | undefined | null

    @StringColumn_({nullable: true})
    bondUnderlyingAssetId!: string | undefined | null

    @Column_("varchar", {length: 10, nullable: false})
    assetType!: AssetType

    @Column_("varchar", {length: 10, nullable: false})
    resourceType!: ResourceType

    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    symbol!: string | undefined | null

    @IntColumn_({nullable: true})
    decimals!: number | undefined | null

    @BigIntColumn_({nullable: true})
    xcmRateLimit!: bigint | undefined | null

    @BooleanColumn_({nullable: false})
    isSufficient!: boolean

    @BigIntColumn_({nullable: false})
    existentialDeposit!: bigint

    @BigIntColumn_({nullable: true})
    bondMaturity!: bigint | undefined | null
}
