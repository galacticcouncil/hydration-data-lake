import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v108 from '../v108'
import * as v115 from '../v115'
import * as v160 from '../v160'
import * as v176 from '../v176'
import * as v222 from '../v222'
import * as v264 from '../v264'

export const registered =  {
    name: 'AssetRegistry.Registered',
    /**
     * Asset was registered. \[asset_id, name, type\]
     */
    v108: new EventType(
        'AssetRegistry.Registered',
        sts.tuple([sts.number(), v108.BoundedVec, v108.AssetType])
    ),
    /**
     * Asset was registered.
     */
    v115: new EventType(
        'AssetRegistry.Registered',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: v115.AssetType,
        })
    ),
    /**
     * Asset was registered.
     */
    v176: new EventType(
        'AssetRegistry.Registered',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: v176.AssetType,
        })
    ),
    /**
     * Asset was registered.
     */
    v222: new EventType(
        'AssetRegistry.Registered',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v222.AssetType,
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
     * Asset was updated. \[asset_id, name, type\]
     */
    v108: new EventType(
        'AssetRegistry.Updated',
        sts.tuple([sts.number(), v108.BoundedVec, v108.AssetType])
    ),
    /**
     * Asset was updated.
     */
    v115: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: v115.AssetType,
        })
    ),
    /**
     * Asset was updated.
     */
    v160: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: v160.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
        })
    ),
    /**
     * Asset was updated.
     */
    v176: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: v176.AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
        })
    ),
    /**
     * Asset was updated.
     */
    v222: new EventType(
        'AssetRegistry.Updated',
        sts.struct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: v222.AssetType,
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
