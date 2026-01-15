import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'

export const lastRelayChainBlockNumber =  {
    /**
     *  The relay chain block number associated with the last parachain block.
     */
    v115: new StorageType('ParachainSystem.LastRelayChainBlockNumber', 'Default', [], sts.number()) as LastRelayChainBlockNumberV115,
}

/**
 *  The relay chain block number associated with the last parachain block.
 */
export interface LastRelayChainBlockNumberV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}
