import { AppConfig } from '../../appConfig';
import { PolkadotApiProvider } from './polkadotApiProvider';
import { StringSanitizer } from '../stringSanitizer';
import { AssetHubAssetMetadata } from '../assetHubManager';

export type TExternalAsset = {
  id: string;
  decimals: number;
  symbol: string;
  name: string;
  origin: number;
  supply?: string;
  isWhiteListed: boolean;
  owner?: string;
  admin?: string;
};

const appConfig = AppConfig.getInstance();

export class AssetHubRpcManager extends PolkadotApiProvider {
  private static instance: AssetHubRpcManager;

  static getInstance(): AssetHubRpcManager {
    if (!AssetHubRpcManager.instance) {
      AssetHubRpcManager.instance = new AssetHubRpcManager(
        appConfig.ASSET_HUB_RPC_URL
      );
    }
    return AssetHubRpcManager.instance;
  }

  private constructor(RPC_URL: string) {
    super(RPC_URL);
  }

  async getAssetMetadata({
    assetId,
    blockHeight,
  }: {
    assetId: number;
    blockHeight?: number;
  }): Promise<AssetHubAssetMetadata | null> {
    const api = await this.getClient();
    if (!api) return null;

    const dataRaw = await api.query.assets.metadata(assetId);

    if (!dataRaw) return null;

    const dataJson: TExternalAsset = dataRaw.toJSON() as TExternalAsset;

    return this.getDecorateAssetMetadata(assetId, dataJson);
  }

  async getAllAssetsMetadata(blockHeight?: number) {
    const api = await this.getClient();
    if (!api) return null;

    const dataRaw = await api.query.assets.metadata.entries();

    if (!dataRaw) return null;

    const dataDecorated: AssetHubAssetMetadata[] = [];

    dataRaw.forEach(([key, data]) => {
      const assetId = key.args[0].toString();
      const dataJson: TExternalAsset = data.toJSON() as TExternalAsset;
      if (dataJson)
        dataDecorated.push(this.getDecorateAssetMetadata(+assetId, dataJson));
    });

    return dataDecorated;
  }

  private getDecorateAssetMetadata(
    assetId: number,
    rawData: TExternalAsset
  ): AssetHubAssetMetadata {
    if (!rawData)
      throw Error(
        'No data provided to AssetHubRpcManager.decorateAssetMetadata'
      );

    return {
      id: assetId,
      decimals: +rawData.decimals,
      name: StringSanitizer.sanitizeString(this.hexToString(rawData.name)),
      symbol: StringSanitizer.sanitizeString(this.hexToString(rawData.symbol)),
    };
  }

  private hexToString(val: any) {
    return Buffer.from(val.slice(2), 'hex').toString('utf8');
  }
}
