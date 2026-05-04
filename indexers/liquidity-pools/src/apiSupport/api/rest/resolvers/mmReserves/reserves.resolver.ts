import { AppConfig } from '../../../../../appConfig';
import { CommonPgPool } from '../../../../../utils/pgConnectionManagers/pgPool';
import { getLatestAavepoolHistData } from '../../../../sql/aavepool/aavepoolHistData';
import { BigNumber } from '../../../../../utils/bignumber';

const appConfig = AppConfig.getInstance();

export type AavepoolHistoricalData = {
  id: string;
  liquidity_in: string;
  liquidity_out: string;
  para_block_height: number;
  pool_id: string;
  block_id: string;
  tvl_in_ref_asset_norm: string;
  reserve_asset_registry_id: string;
  a_token_registry_id: string;
  a_token_total_supply: string;
  variable_debt_token_total_supply: string;
  reserve_asset_id: string;
  a_token_id: string;
};

export type MmReserveState = {
  aTokenTotalSupply: string;
  variableDebtTokenTotalSupply: string;
  tvl: string;
  tvlInRefAssetNorm: string;
  utilizationRate: string;
  paraBlockHeight: number;
};

export async function getMmReserveStateResolver({
  aTokenId,
  underliningAssetId,
}: {
  underliningAssetId: string;
  aTokenId: string;
}): Promise<MmReserveState | null> {
  const pgClient = CommonPgPool.getInstance();

  try {
    const latestAavepoolState = (
      await pgClient.query<{
        liquidity_in: string;
        tvl_in_ref_asset_norm: string;
        a_token_total_supply: string;
        variable_debt_token_total_supply: string;
        para_block_height: number;
      }>(getLatestAavepoolHistData, [underliningAssetId, aTokenId])
    ).rows[0];

    if (!latestAavepoolState) {
      return null;
    }

    return {
      aTokenTotalSupply: latestAavepoolState.a_token_total_supply,
      variableDebtTokenTotalSupply:
        latestAavepoolState.variable_debt_token_total_supply,
      tvl: latestAavepoolState.liquidity_in,
      tvlInRefAssetNorm: latestAavepoolState.tvl_in_ref_asset_norm,
      utilizationRate: BigNumber(
        latestAavepoolState.variable_debt_token_total_supply
      )
        .div(latestAavepoolState.a_token_total_supply)
        .toFixed(10),
      paraBlockHeight: latestAavepoolState.para_block_height,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
