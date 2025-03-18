import { ApiPromise } from '@polkadot/api';
export declare class OnChainEventsService {
    private readonly polkadotApiProvider;
    constructor(polkadotApiProvider: ApiPromise);
    subscribeToEvents(): Promise<void>;
}
