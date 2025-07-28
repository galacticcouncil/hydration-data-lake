export enum ProxyApiRoute {
  'subscan' = '/proxy/subscan',
  'defillama' = '/proxy/defillama',
}

export enum SubscanAllowedSection {
  xcm = 'xcm',
}
export enum SubscanAllowedXcmQuery {
  list = 'list',
}

export const allowedQueriesSubscan: Map<
  string,
  Map<string, Map<string, boolean>>
> = new Map([['polkadot', new Map([['xcm', new Map([['list', true]])]])]]);

export const allowedQueriesDefillama: Map<
  string,
  Map<string, boolean>
> = new Map([['yields', new Map([['chart', true]])]]);
