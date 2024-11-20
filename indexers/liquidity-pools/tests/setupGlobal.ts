import * as dotenv from 'dotenv';

dotenv.config({
  path: (() => {
    let envFileName = '.env.hydration.test';
    return `${__dirname}/../${envFileName}`;
  })(),
});

jest.setTimeout(60_000);

global.console.warn = jest.fn();
