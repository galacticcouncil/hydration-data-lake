import pako from 'pako';

export class PakoManager {
  static uint8ArrayToBase64(array: Uint8Array) {
    return Buffer.from(array).toString('base64');
  }

  static base64ToUint8Array(base64: string) {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }

  static compress({
    payload,
    stringifyPayload = true,
  }: {
    payload: any;
    stringifyPayload?: boolean;
  }) {
    try {
      return this.uint8ArrayToBase64(
        pako.gzip(stringifyPayload ? JSON.stringify(payload) : payload, {
          level: 8,
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  static decompress(data: string, parse = true) {
    try {
      const decomprResult = pako.ungzip(this.base64ToUint8Array(data), {
        to: 'string',
      });

      return !parse ? decomprResult : JSON.parse(decomprResult);
    } catch (e) {
      console.log(e);
    }
    return undefined;
  }
}
