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
// const compressedRes = 'H4sIAAAAAAAAA+1bTW8cxxH9L3tWgK7vLt0SBIFzCmD7FvgwJFcW4ZUo7G5sywL/e14NKZFD9CZKQMxBXAlacTjDnu6u1++9qm5+2uwuPny4udltXv/zp1efL/58OGyPh79Ox+nu279//OXhmfuLp88cjtPFbnv4bfrw9Hp+8uHBm3fvr+9b+7S5vtq83rTf/crfuPolPq986xkNX73xy/aVf/7kma1R27zazH27utpvD4dnaRpNvv3XxTyGH/fT1XRxvbs+fty8/rS5uD7iFXSLd0776S+7m8tfvtte//z2uHl9351Xm/12N31c3GKNdG95+2gqHs/Q880J4SOMH83NVO/5O5q/v/VqczHtpveX20ON581+u8WbvYd0FVIi3dQIDtv9r9u5T7h8d324/Nv+5o/t+/tvvNlul9eLi9308xyGze392384TsdtvQ2T+v1d07ivytmYQpnUoyd+9PB22le/Ns6a0rK3iF7x3d8cby5vdj98vm+OrhruXBb0NjwI4HEO3G77KGp2+3/G7Q5h1dJzYxc9esbg0zDuNAx5dsfkqvW14i0uTQG0FOrAoS4CDnBakIr7KNztS6TtHOk50sNAD+NM2Xr00M7ikRT4b62It8cRbv85sCcC+a3HUYeB1DFJu3az0EwNpbDmq0VSKbE8Uw2vjkjTx5FFnxoF+hVi2RGBFqNYEzpvkeHgAAyaQ74EX+y8qgsNOURDjvnbm6WE5Gr8beCQUmV39gaufsLfD6E78/dX2LQTFm3M4RwcsGfptfIF7gh+CQK+2vq3Fh5uSYTAE8ti/RPX8jdXdCsgMvgK3s6Mh84N2u/C8JnOIhIa1vkLPKid8VGNDtExxkaXnsyKADXx5LTu/FywoKhwUxd1WLdkoRCqXKFJkPWuBNfG/b+JR4MiZBezBv5QW9gChaiYckOT7BQuGM8INxJWHoYhQh1oc5F2EjUvEzMyNIUydoWChRzsnLMdr79a0bE5qVqFUuAoUpjdwuqLBaNweRtMgaY5EMEN9Dd7hiGlkEknpqa9Y/itE0Zxlzfew8PO8AA8ZAgPGcIjGhLDwMQ3LDlEoyV3rQW6GjoYrwNbCF7ahWWRLFohozU2wAe+VKGNDl7pNkKHkjb4Um2GoUM+oVDgSotz8eCJJbGhI7Gx+WyJLMTCwe1sslrNiKtoBB2q90aDVDwxocpIMrp3Lo/ShmwBIFuWgQVwjOUkS7xUHHAf4YD7WEbgCF0SZg9GQSHODXq+mistNwrXGfAiEr3N6vCgIdyRqpB2gYkRwEWA02FiKhhFIpkCx5mbpJtTnunhCSyGlpRPeFJlZPk9PTu8nSBXbLyadHTAAUHjJEa+pG5LihC4TGChg7agMR0k4jYuV1BhmTt4hqEfs0M5ZynLLHZch2xjz+mwFA6zR7CaAAb31YgCTiKDSGAYWhXQFogAhTiyC+OSBbhhGcKhCtbwGkALzYUXov9VOfq3joahwaSxwTTCMm0EeoYU99p64mgGWV+tmqXZFflCgVFUMxZJKexna3PfwCNMVdDAR+SQKCB61DgAssDo2Qjg6PlgMPXMFrOCxFBBYogPhaS3NC5/AUnWtt42FaKp0AYY204tF8UK8ii6AHRgIsEp4xIXENWAZI3eG4zJIyTEGQhFFD4kCh+XPkkds84B7vVOtU3dFeNdz2XCDcI0gATgaJANL9WjdmN61SaAVKn6eJLVgzJMPZIbGoIhZaQfeNQZXsX4XB1/6itOHGAYH15A5oHcP7TsGlYeLsMIy7fRehAxEamSfLizUixZI1SyklXDP2pVRwWhEYA8AgnQDulxtIZPUAmUxIH8PC0nLxQlw3rFuFyBVBD6jWWcXEVmWk1MbM5BslMa5CCsLYDB5UFIOgwlM7WxmgAw1uApYC8YT/vpTdOXu5cGVtVTR55w68S+ifUqFnVYNqFaYc1Xw0VvDtEg8AWSDuFYpqjwFVbZhhv8MUTi1Cko8noG+IGY9NSzjCwbHRayxnUsCIgkgbwF9s/g39tq+yCMyEkZgcQy974sYjlRpAgekNqgUR5rhnTkHzApGGtV4no+sASfj1Z8JolwO3ku0sfCgRSVHXKdrAoeZk9azVTU3jhWuFJ1ofbnnpy38Kq6Ik9KJNIhuDifvPgaIIyt5dhZQhyQCHp5yaLZrutVJ5DvMKygaIotk1BOTaMEJXgKvOH4sJVQAjZopcFX3BW+x/bxhcJgWIygcTGizk16GXHkeKBjeP3VdjgMCxuWFdrQYQpiYRSkB9d5G0Z8hdXZx0io7dvapwNWAJrzzsaTRoeH7sZn7uDXwbvl12v/2V2bNO5w96uVLaN2VhpwyJAGt9mxPpQtLcu+pBrCLa3DGJLMB7aG1QjxqmKB2bT7zCbQm976t1GO+AnTOP26ffgVlu276R/76bJ6XpfzHH93fTje7K8vp93nX1W5/Tf3jGhDHTMAAA==';
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
