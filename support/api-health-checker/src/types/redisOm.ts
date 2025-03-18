export enum RedisOmEntityId {
  LATEST_PROCESSED_BLOCKS = 'LATEST_PROCESSED_BLOCKS',
  MM_EVENTS_STATUS_SCORE = 'MM_EVENTS_STATUS_SCORE',
  SWAPPED_EVENTS_STATUS_SCORE = 'SWAPPED_EVENTS_STATUS_SCORE',
  NOTIFICATION_TRIGGERS_STATE = 'NOTIFICATION_TRIGGERS_STATE',
}

export type InitializedEntity = {
  initialized: boolean;
};

export type LatestProcessedBlocksEntity = InitializedEntity & {
  latestOnChainBlockHeight: number;
  latestIndexerBlockHeight: number;
};

export type MmEventsStatusScoreEntity = InitializedEntity & {
  mmEventsTrackingStatusScore: number;
};
export type SwappedEventsStatusScoreEntity = InitializedEntity & {
  swappedEventsTrackingStatusScore: number;
};

export type NotificationTriggersStateEntity = InitializedEntity & {
  processedBlocksDifference: number;
  swappedEventsTrackingStatus: number;
  mmEventsTrackingStatus: number;
};
