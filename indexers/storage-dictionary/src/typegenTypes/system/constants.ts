import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v104 from '../v104'
import * as v115 from '../v115'
import * as v160 from '../v160'

export const blockWeights =  {
    /**
     *  Block & extrinsics weights: base values and limits.
     */
    v100: new ConstantType(
        'System.BlockWeights',
        v100.BlockWeights
    ),
    /**
     *  Block & extrinsics weights: base values and limits.
     */
    v115: new ConstantType(
        'System.BlockWeights',
        v115.BlockWeights
    ),
    /**
     *  Block & extrinsics weights: base values and limits.
     */
    v160: new ConstantType(
        'System.BlockWeights',
        v160.BlockWeights
    ),
}

export const blockLength =  {
    /**
     *  The maximum length of a block (in bytes).
     */
    v100: new ConstantType(
        'System.BlockLength',
        v100.BlockLength
    ),
}

export const blockHashCount =  {
    /**
     *  Maximum number of block number to block hash mappings to keep (oldest pruned first).
     */
    v100: new ConstantType(
        'System.BlockHashCount',
        sts.number()
    ),
}

export const dbWeight =  {
    /**
     *  The weight of runtime database operations the runtime can invoke.
     */
    v100: new ConstantType(
        'System.DbWeight',
        v100.RuntimeDbWeight
    ),
}

export const version =  {
    /**
     *  Get the chain's current version.
     */
    v100: new ConstantType(
        'System.Version',
        v100.RuntimeVersion
    ),
    /**
     *  Get the chain's current version.
     */
    v104: new ConstantType(
        'System.Version',
        v104.RuntimeVersion
    ),
}

export const ss58Prefix =  {
    /**
     *  The designated SS85 prefix of this chain.
     * 
     *  This replaces the "ss58Format" property declared in the chain spec. Reason is
     *  that the runtime should know about the prefix in order to make use of it as
     *  an identifier of the chain.
     */
    v100: new ConstantType(
        'System.SS58Prefix',
        sts.number()
    ),
}
