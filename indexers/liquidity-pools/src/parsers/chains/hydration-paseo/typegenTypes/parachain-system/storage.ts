import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'

export const lastRelayChainBlockNumber =  {
    /**
     *  The relay chain block number associated with the last parachain block.
     * 
     *  This is updated in `on_finalize`.
     */
    v287: new StorageType('ParachainSystem.LastRelayChainBlockNumber', 'Default', [], sts.number()) as LastRelayChainBlockNumberV287,
}

/**
 *  The relay chain block number associated with the last parachain block.
 * 
 *  This is updated in `on_finalize`.
 */
export interface LastRelayChainBlockNumberV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}
