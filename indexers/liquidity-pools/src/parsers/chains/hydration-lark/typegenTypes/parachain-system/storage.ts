import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'

export const lastRelayChainBlockNumber =  {
    /**
     *  The relay chain block number associated with the last parachain block.
     * 
     *  This is updated in `on_finalize`.
     */
    v405: new StorageType('ParachainSystem.LastRelayChainBlockNumber', 'Default', [], sts.number()) as LastRelayChainBlockNumberV405,
}

/**
 *  The relay chain block number associated with the last parachain block.
 * 
 *  This is updated in `on_finalize`.
 */
export interface LastRelayChainBlockNumberV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}
