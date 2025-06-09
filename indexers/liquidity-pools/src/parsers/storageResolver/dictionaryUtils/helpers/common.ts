import { BatchStorageStateSectionNode } from '../storageDictionaryManager';
import { ProcessingTopic } from '../types';

/**
 * Get storage dictionary items by block number. Id of item must have format:
 * - <entity_id>-<block_height>
 * - <entity_a_id>-<entity_b_id>-<block_height>
 */
export function getStorageDictionaryItemsListByBlockNumber<
  T extends ProcessingTopic,
>({
  fullData,
  blockNumber,
  additionalFilter = () => true,
}: {
  fullData: Map<string, BatchStorageStateSectionNode<T>>;
  blockNumber: number;
  additionalFilter?: ([key, data]: [
    string,
    BatchStorageStateSectionNode<T>,
  ]) => boolean;
}): [string, BatchStorageStateSectionNode<T>][] {
  const blockHeightStr = blockNumber.toString();
  const filteredNodes: [string, BatchStorageStateSectionNode<T>][] = [];

  for (const [key, data] of fullData) {
    const lastHyphenIndex = key.lastIndexOf('-');
    if (lastHyphenIndex !== -1) {
      const keyHeight = key.substring(lastHyphenIndex + 1);
      if (keyHeight === blockHeightStr && additionalFilter([key, data])) {
        filteredNodes.push([key, data]);
      }
    }
  }

  return filteredNodes;
}
