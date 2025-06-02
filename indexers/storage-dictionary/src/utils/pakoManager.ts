import pako from 'pako';

export class PakoManager {
  static uint8ArrayToBase64(array: Uint8Array) {
    return Buffer.from(array).toString('base64');
  }

  static base64ToUint8Array(base64: string) {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }

  static compress(payload: any) {
    const input = Buffer.isBuffer(payload)
      ? payload
      : Buffer.from(
          typeof payload === 'object' ? JSON.stringify(payload) : payload,
          'base64'
        );
    try {
      return this.uint8ArrayToBase64(pako.deflate(input));
    } catch (e) {
      console.log(e);
      return payload;
    }
  }

  static decompress(data: string, parse = true) {
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
