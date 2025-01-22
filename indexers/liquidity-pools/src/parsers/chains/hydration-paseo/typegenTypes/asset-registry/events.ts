import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v257 from '../v257'
import * as v264 from '../v264'

export const registered =  {
    name: 'AssetRegistry.Registered',
    /**
     * Asset was registered.
     */
    v257: new EventType(
        'AssetRegistry.Registered',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v257.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        })
    ),
    /**
     * Asset was registered.
     */
    v264: new EventType(
        'AssetRegistry.Registered',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v264.AssetType,
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
    v257: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v257.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        })
    ),
    /**
     * Asset was updated.
     */
    v264: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v264.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        })
    ),
}
