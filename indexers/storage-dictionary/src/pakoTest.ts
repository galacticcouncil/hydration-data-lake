// import pako from 'pako';
// import sizeof from 'object-sizeof';
//
// class PakoTest {
//   uint8ArrayToBase64(array: Uint8Array) {
//     return Buffer.from(array).toString('base64');
//   }
//
//   base64ToUint8Array(base64: string) {
//     return Uint8Array.from(Buffer.from(base64, 'base64'));
//   }
//
//   compress({
//     payload,
//     stringifyPayload = true,
//   }: {
//     payload: any;
//     stringifyPayload?: boolean;
//   }) {
//     try {
//       return this.uint8ArrayToBase64(
//         pako.deflate(stringifyPayload ? JSON.stringify(payload) : payload)
//       );
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   decompress(data: string, parse = true) {
//     try {
//       // const decomprResult = pako.inflate(this.base64ToUint8Array(data), {
//       const decomprResult = pako.ungzip(this.base64ToUint8Array(data), {
//         to: 'string',
//       });
//
//       return !parse ? decomprResult : JSON.parse(decomprResult);
//     } catch (e) {
//       console.log(e);
//     }
//     return undefined;
//   }
// }
//
// const payload = [
//   {
//     id: '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-6389493',
//     assetBId: 1000091,
//     assetAId: 1000524,
//     paraBlockHeight: 6389493,
//     poolAddress:
//       '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51',
//     relayBlockHeight: 23395539,
//     xykPoolAssetsDataByPoolId: {
//       nodes: [
//         {
//           assetId: 1000091,
//           balances: {
//             free: '10000000000',
//             flags: '0',
//             frozen: '0',
//             reserved: '0',
//             feeFrozen: '0',
//             miscFrozen: '0',
//           },
//           id: '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-1000091-6389493',
//           paraBlockHeight: 6389493,
//           poolId:
//             '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-6389493',
//           relayBlockHeight: 23395539,
//         },
//         {
//           assetId: 1000524,
//           balances: {
//             free: '500000000000000',
//             flags: '0',
//             frozen: '0',
//             reserved: '0',
//             feeFrozen: '0',
//             miscFrozen: '0',
//           },
//           id: '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-1000524-6389493',
//           paraBlockHeight: 6389493,
//           poolId:
//             '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-6389493',
//           relayBlockHeight: 23395539,
//         },
//       ],
//     },
//   },
// ];
//
// console.time('compress');
// // const compressedRes = new PakoTest().compress({ payload });
// const compressedRes = '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';
// console.timeEnd('compress');
//
// // console.log(compressedRes);
//
// console.time('decompress');
// console.dir(new PakoTest().decompress(compressedRes || ''), { depth: null });
// console.timeEnd('decompress');
//
// console.log(
//   `Size of the batchStorageState object: ${sizeof(compressedRes)} bytes`
// );
// console.log(
//   `Size of the batchStorageState object: ${sizeof(new PakoTest().decompress(compressedRes || ''))} bytes`
// );
