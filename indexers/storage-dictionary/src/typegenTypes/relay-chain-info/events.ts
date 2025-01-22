import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'

export const currentBlockNumbers =  {
    name: 'RelayChainInfo.CurrentBlockNumbers',
    /**
     * Current block numbers
     * [ Parachain block number, Relaychain Block number ]
     */
    v104: new EventType(
        'RelayChainInfo.CurrentBlockNumbers',
        sts.tuple([sts.number(), sts.number()])
    ),
    /**
     * Current block numbers
     * [ Parachain block number, Relaychain Block number ]
     */
    v115: new EventType(
        'RelayChainInfo.CurrentBlockNumbers',
        sts.struct({
            parachainBlockNumber: sts.number(),
            relaychainBlockNumber: sts.number(),
        })
    ),
}
