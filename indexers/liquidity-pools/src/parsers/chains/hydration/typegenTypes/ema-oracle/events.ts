import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'

export const addedToWhitelist =  {
    name: 'EmaOracle.AddedToWhitelist',
    /**
     * Oracle was added to the whitelist.
     */
    v227: new EventType(
        'EmaOracle.AddedToWhitelist',
        sts.struct({
            source: sts.bytes(),
            assets: sts.tuple(() => [sts.number(), sts.number()]),
        })
    ),
}

export const removedFromWhitelist =  {
    name: 'EmaOracle.RemovedFromWhitelist',
    /**
     * Oracle was removed from the whitelist.
     */
    v227: new EventType(
        'EmaOracle.RemovedFromWhitelist',
        sts.struct({
            source: sts.bytes(),
            assets: sts.tuple(() => [sts.number(), sts.number()]),
        })
    ),
}
