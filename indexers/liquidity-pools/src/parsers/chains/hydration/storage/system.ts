import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  EmaOracleEntryData,
  GetDataAtBlockInput,
  SystemAccountInfo,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { hexToString } from '@polkadot/util';
import { EmaOraclePeriod } from '../../../../model';

async function getSystemAccount(
  account: string,
  block: BlockHeader
): Promise<SystemAccountInfo | null> {
  if (storage.system.account.v100.is(block)) {
    const resp = await storage.system.account.v100.get(block, account);
    if (!resp) return null;

    return {
      nonce: resp.nonce,
      consumers: resp.consumers,
      providers: resp.providers,
      sufficients: resp.sufficients,
      data: {
        free: resp.data.free,
        reserved: resp.data.reserved,
        miscFrozen: resp.data.miscFrozen,
        feeFrozen: resp.data.feeFrozen,
        flags: BigInt(0),
        frozen: BigInt(0),
      },
    };
  }
  if (storage.system.account.v205.is(block)) {
    const resp = await storage.system.account.v205.get(block, account);
    if (!resp) return null;

    return {
      nonce: resp.nonce,
      consumers: resp.consumers,
      providers: resp.providers,
      sufficients: resp.sufficients,
      data: {
        free: resp.data.free,
        reserved: resp.data.reserved,
        miscFrozen: BigInt(0),
        feeFrozen: BigInt(0),
        frozen: resp.data.frozen,
        flags: resp.data.flags,
      },
    };
  }

  throw new UnknownVersionError('storage.system.account');
}
//
// async function getSystemAccountsAll({
//   block,
// }: GetDataAtBlockInput): Promise<SystemAccountInfo[] | null> {
//   if (storage.system.account.v100.is(block)) {
//     const pairsPaged = [];
//
//     for await (const page of storage.system.account.v100.getPairsPaged(
//       500,
//       block
//     ))
//       pairsPaged.push(
//         ...page
//           .filter((p) => !!p && !!p[1])
//           .map(([account, info]): SystemAccountInfo | null => {
//             if (!info) return null;
//
//             return {
//               nonce: info.nonce,
//               consumers: info.consumers,
//               providers: info.providers,
//               sufficients: info.sufficients,
//               data: {
//                 free: info.data.free,
//                 reserved: info.data.reserved,
//                 miscFrozen: info.data.miscFrozen,
//                 feeFrozen: info.data.feeFrozen,
//                 flags: BigInt(0),
//                 frozen: BigInt(0),
//               },
//             };
//           })
//           .filter((resp) => !!resp)
//       );
//   }
//   if (storage.system.account.v205.is(block)) {
//     const resp = await storage.system.account.v205.get(block, account);
//     if (!resp) return null;
//
//     return {
//       nonce: resp.nonce,
//       consumers: resp.consumers,
//       providers: resp.providers,
//       sufficients: resp.sufficients,
//       data: {
//         free: resp.data.free,
//         reserved: resp.data.reserved,
//         miscFrozen: BigInt(0),
//         feeFrozen: BigInt(0),
//         frozen: resp.data.frozen,
//         flags: resp.data.flags,
//       },
//     };
//   }
//
//   throw new UnknownVersionError('storage.system.account');
// }

export default { getSystemAccount };
