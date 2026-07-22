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
> = new Map([
  ['polkadot', new Map([['xcm', new Map([['list', true]])]])],
  ['hydration', new Map([['token', new Map([['##none##', true]])]])],
]);

export type DefillamaAllowedQuery = true | Map<string, boolean>;

export const allowedQueriesDefillama: Map<
  string,
  Map<string, Map<string, DefillamaAllowedQuery>>
> = new Map([
  [
    'yields',
    new Map([
      ['chart', new Map<string, DefillamaAllowedQuery>([['##any##', true]])],
    ]),
  ],
  [
    'api',
    new Map([
      [
        'v2',
        new Map<string, DefillamaAllowedQuery>([
          ['historicalChainTvl', new Map([['HydraDX', true]])],
        ]),
      ],
      [
        'summary',
        new Map<string, DefillamaAllowedQuery>([
          ['dexs', new Map([['hydration-dex', true]])],
        ]),
      ],
    ]),
  ],
]);

export const allowedQueriesKamino: Map<string, boolean> = new Map([
  ['yields', true],
]);

export const allowedQueriesSubsquare: Map<
  string,
  Map<string, boolean>
> = new Map([['referenda', new Map([['votes', true]])]]);
