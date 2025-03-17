export enum ProxyApiRoute {
  'subscan' = '/proxy/subscan',
}

export enum SubscanAllowedSection {
  xcm = 'xcm',
}
export enum SubscanAllowedXcmQuery {
  list = 'list',
}

export const allowedQueries: Map<
  string,
  Map<string, Map<string, boolean>>
> = new Map([['polkadot', new Map([['xcm', new Map([['list', true]])]])]]);
