import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v160 from '../v160'
import * as v253 from '../v253'

export const maxPriceDifferenceBetweenBlocks =  {
    /**
     * Max price difference allowed between blocks
     */
    v160: new ConstantType(
        'DCA.MaxPriceDifferenceBetweenBlocks',
        v160.Permill
    ),
}

export const maxSchedulePerBlock =  {
    /**
     * The number of max schedules to be executed per block
     */
    v160: new ConstantType(
        'DCA.MaxSchedulePerBlock',
        sts.number()
    ),
}

export const maxNumberOfRetriesOnError =  {
    /**
     * The number of max retries in case of trade limit error
     */
    v160: new ConstantType(
        'DCA.MaxNumberOfRetriesOnError',
        sts.number()
    ),
}

export const nativeAssetId =  {
    /**
     *  Native Asset Id
     */
    v160: new ConstantType(
        'DCA.NativeAssetId',
        sts.number()
    ),
}

export const minBudgetInNativeCurrency =  {
    /**
     * Minimum budget to be able to schedule a DCA, specified in native currency
     */
    v160: new ConstantType(
        'DCA.MinBudgetInNativeCurrency',
        sts.bigint()
    ),
}

export const feeReceiver =  {
    /**
     * The fee receiver for transaction fees
     */
    v160: new ConstantType(
        'DCA.FeeReceiver',
        v160.AccountId32
    ),
}

export const namedReserveId =  {
    /**
     *  Named reserve identifier to store named reserves for orders of each users
     */
    v160: new ConstantType(
        'DCA.NamedReserveId',
        sts.bytes()
    ),
}

export const minimumTradingLimit =  {
    /**
     *  Minimum trading limit for a single trade
     */
    v170: new ConstantType(
        'DCA.MinimumTradingLimit',
        sts.bigint()
    ),
}

export const maxConfigurablePriceDifferenceBetweenBlocks =  {
    /**
     * Max configurable price difference allowed between blocks
     */
    v253: new ConstantType(
        'DCA.MaxConfigurablePriceDifferenceBetweenBlocks',
        v253.Permill
    ),
}

export const minimalPeriod =  {
    /**
     * Minimal period between executions
     */
    v253: new ConstantType(
        'DCA.MinimalPeriod',
        sts.number()
    ),
}

export const bumpChance =  {
    /**
     * Chance of the random rescheduling
     */
    v253: new ConstantType(
        'DCA.BumpChance',
        v253.Percent
    ),
}

export const polkadotNativeAssetId =  {
    /**
     *  Polkadot Native Asset Id (DOT)
     */
    v264: new ConstantType(
        'DCA.PolkadotNativeAssetId',
        sts.number()
    ),
}
