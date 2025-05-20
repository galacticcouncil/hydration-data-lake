import { RuntimeApiResolver } from '../../parsers/runtimeApiResolver';
import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
  RuntimeApiMethodName,
  RuntimeApiName,
} from '../../parsers/runtimeApiResolver/types';
import { Block } from '../../processor';

export async function getAllAavePools({
  block,
}: {
  block: Block;
}): Promise<AaveTradeExecutorPoolDataWithPoolId[]> {
  try {
    const allPools = await new RuntimeApiResolver().resolveRuntimeApiCall<
      AaveTradeExecutorPoolsInput,
      AaveTradeExecutorPoolDataWithPoolId[] | null
    >({
      apiName: RuntimeApiName.AaveTradeExecutor,
      apiMethod: RuntimeApiMethodName.pools,
      args: {
        block,
      },
    });
    return allPools ?? [];
  } catch (e) {
    console.log(
      `AaveTradeExecutor :: get all pools Runtime Api Call is not available`
    );
    return [];
  }
}
