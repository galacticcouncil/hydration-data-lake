export enum ProxyApiRoute {
  'subscan' = '/subscan',
  'defillama' = '/defillama',
  'kamino' = '/kamino',
  'subsquare' = '/subsquare',
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

export const allowedQueriesKamino: Map<string, boolean> = new Map([
  ['yields', true],
]);

export const allowedQueriesSubsquare: Map<
  string,
  Map<string, boolean>
> = new Map([['referenda', new Map([['votes', true]])]]);
