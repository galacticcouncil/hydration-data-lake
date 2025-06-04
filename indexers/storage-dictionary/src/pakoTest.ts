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
// const compressedRes = 'H4sIAAAAAAAAA61TQW7CMBD8y55TKWnBUbi1qip6qlR6q3rY2BuwMDiyXQpF+XttxyiBU4XIwfJsRjPr8foIqm5brRXMPr+yE3i0lpx9Rod9eX9YD5wELjnWYa3I/mB7iSNzIOrNVia1I0gBM8j3TLCGTRj3q2DEqjL3u4bx/J/fXTGpyul9CRnE3oQwZO1NpL3k6ruOZ/gwKLCWSroDzI5QS+ctis57osEnpfl6TnK5cr7Yt5OBIYWH818PRTWtpnk3imKc0A0zGaWCweHVCxcZ1Khwy8mGMzSGKLhBaNWS2ZFIcCMtfzH6l7ap0BCd4zOgcBnzhi6ZLRw6ChY+vfdeOnHtCg3ZBFqjneZaLcZFHoYo7lyMXNE47ysD70cjCN166Lpwl4g7Gh4JbfDNIA+NBxgTmUvrtJEc1ekxdH/STYPifwMAAA==';
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
