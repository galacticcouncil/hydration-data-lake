import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const registered =  {
    name: 'AssetRegistry.Registered',
    /**
     * Asset was registered.
     */
    v324: new EventType(
        'AssetRegistry.Registered',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v324.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        })
    ),
}

export const updated =  {
    name: 'AssetRegistry.Updated',
    /**
     * Asset was updated.
     */
    v324: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v324.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        })
    ),
}

export const locationSet =  {
    name: 'AssetRegistry.LocationSet',
    /**
     * Native location set for an asset.
     */
    v324: new EventType(
        'AssetRegistry.LocationSet',
        sts.struct({
            assetId: sts.number(),
            location: v324.AssetLocation,
        })
    ),
}
