import * as dotenv from 'dotenv';


dotenv.config({
  path: (() => {
    let envFileName = '';
    if (process.env.TARGET === 'storage_dictionary') envFileName = '.env.hydration.storage-dict-indexer';
    else if (process.env.TARGET === 'liquidity_pools')
      envFileName = '.env.hydration.liq-pools-indexer';
    else
      throw Error('Unknown TARGET environment variable');

    return `${__dirname}/${envFileName}`;
  })(),
});

jest.setTimeout(60_000);

global.console.warn = jest.fn();
