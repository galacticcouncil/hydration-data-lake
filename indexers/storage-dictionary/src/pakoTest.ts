import pako from 'pako';

class PakoTest {
  uint8ArrayToBase64(array: Uint8Array) {
    return Buffer.from(array).toString('base64');
  }

  base64ToUint8Array(base64: string) {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }

  compress({
    payload,
    stringifyPayload = true,
  }: {
    payload: any;
    stringifyPayload?: boolean;
  }) {
    try {
      return this.uint8ArrayToBase64(
        pako.deflate(stringifyPayload ? JSON.stringify(payload) : payload)
      );
    } catch (e) {
      console.log(e);
    }
  }

  decompress(data: string, parse = true) {
    try {
      const decomprResult = pako.inflate(this.base64ToUint8Array(data), {
        to: 'string',
      });

      return !parse ? decomprResult : JSON.parse(decomprResult);
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }
}

const payload = [
  {
    id: '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-6389493',
    assetBId: 1000091,
    assetAId: 1000524,
    paraChainBlockHeight: 6389493,
    poolAddress:
      '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51',
    relayChainBlockHeight: 23395539,
    xykPoolAssetsDataByPoolId: {
      nodes: [
        {
          assetId: 1000091,
          balances: {
            free: '10000000000',
            flags: '0',
            frozen: '0',
            reserved: '0',
            feeFrozen: '0',
            miscFrozen: '0',
          },
          id: '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-1000091-6389493',
          paraChainBlockHeight: 6389493,
          poolId:
            '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-6389493',
          relayChainBlockHeight: 23395539,
        },
        {
          assetId: 1000524,
          balances: {
            free: '500000000000000',
            flags: '0',
            frozen: '0',
            reserved: '0',
            feeFrozen: '0',
            miscFrozen: '0',
          },
          id: '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-1000524-6389493',
          paraChainBlockHeight: 6389493,
          poolId:
            '0x00d7288f8cf3952a5233c6078acb85b4091e55f034e0ca2398d0ae0d0c480a51-6389493',
          relayChainBlockHeight: 23395539,
        },
      ],
    },
  },
];

console.time('compress');
const compressedRes = new PakoTest().compress({ payload });
console.timeEnd('compress');

console.log(compressedRes);

console.time('decompress');
console.dir(new PakoTest().decompress(compressedRes || ''), { depth: null });
console.timeEnd('decompress');
