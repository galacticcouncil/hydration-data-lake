export type IndexerStatusResponse = {
  latestOnChainBlockHeight: number;
  latestIndexerBlockHeight: number;
  mmEventsTrackingStatusScore: number;
  swappedEventsTrackingStatusScore: number;
};
