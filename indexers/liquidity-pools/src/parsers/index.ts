import { ParserMethods } from './types/common';

export function getParsers(): ParserMethods {
  console.log('process.env.CHAIN - ', process.env.CHAIN);
  switch (process.env.CHAIN) {
    case 'hydration':
      return require('./chains/hydration').default;
    case 'hydration_paseo':
      return require('./chains/hydration-paseo').default;
    default:
      throw new Error(`Unsupported chain ${process.env.CHAIN}`);
  }
}

export default getParsers();
