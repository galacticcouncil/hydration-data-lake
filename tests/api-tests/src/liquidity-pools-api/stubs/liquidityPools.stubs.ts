export const blocksMeta = {
  // 3681428: {
  //   height: 3681428,
  //   hash: '0xfa8061028cdc118a785df37876163229da3c7ff6db586e16d3fce0d37548aa61',
  //   description: 'First LBP Pool A created',
  // },
  // 3684420: {
  //   height: 3684420,
  //   hash: '0xf2177c487d3ca01b4a1cfbf37afcf1c05952583e272e07c1159894d81c0c21ce',
  // },
  // 3688821: {
  //   height: 3688821,
  //   hash: '0x5abec76db22a3a30a7426fa8de002fb074bff817e8736802412f6ae9bbffabca',
  //   description: 'Last action with LBP Pool A has happened',
  // },
  // 4187219: {
  //   height: 4187219,
  //   hash: '0xdb4db487299b80de61d315d6af0c2f3fd009f26494ee3b79abcf99c58dc2c49c',
  //   description: 'LBP Pool B created',
  // },

  // Should be FROM block for indexing
  4187499: {
    height: 4187499,
    hash: '0x167adb2abbd391a558a2b59311837ea817b9944da8649230588b935966010592',
    description: 'LBP Pool B has data',
  },
  4187514: {
    height: 4187514,
    hash: '0x3006d005c76ec81885bbc5118c3a7ba88680b0619f1e1a453857e5220a3bc76a',
    description: 'Omnipool asset 5 has data',
  },
  4187519: {
    height: 4187519,
    hash: '0x7f93a3f4b773986664887d9d29de88a5b57e7f98c436a28829c29ef2fd9825b6',
    description: 'Stablepool A has data',
  },
  4187565: {
    height: 4187565,
    hash: '0xc0ded0b820029b88ba6c2bd1bfa985421f60ae4f691bfd1601b496d72f4ff5a0',
    description: 'XYK Pool A has data',
  },
  4187936: {
    height: 4187936,
    hash: '0x8984c4052460eebb3a0147cace9c85b1f1779a996b7dc020d97ca487bd34ccde',
    description: 'XYK Pool A has data',
  },
  4198142: {
    height: 4198142,
    hash: '0xbd7f362f2461fc59a4894153514a536bc771012b019877dfda507e3b7c0ea0ce',
    description: 'LBP Pool B has data',
  },
  4198163: {
    height: 4198163,
    hash: '0xa63aae8efb060fd5d6fc0aadeebef3c814465a8ea52ced668b2fcfdef977f70c',
    description: 'Last action with LBP Pool B has happened',
  },
  4198517: {
    height: 4198517,
    hash: '0xb155440f12f402d234040a410260c25d647e139e06df234694d6172214ef1a80',
    description: 'Omnipool asset 5 has data',
  },
  4197907: {
    height: 4197907,
    hash: '0x08762b59e0c74102499b823e853bc5c5fc7e6361219e227e9b3ca7a5d2059058',
    description: 'Stablepool A has data',
  },
  // Should be TO block for indexing
  4198533: {
    height: 4198533,
    hash: '0xa7b32c6d5d2e02766708a05bf346edcb6b2a3947ff24065c3b08de9a019b10dc',
    description: 'XYK Pool A has data',
  },
};

export default {
  lbpPoolHistoricalData: {
    pools: {
      poolA: {
        address:
          '0x13bd3914a8887011d44e85e99181193f9024f3f58d352d5ad01a4dc024c4124b',
        assets: [5, 1000010],
      },
      poolB: {
        address:
          '0xf3e15505b2cd0c229c40146d26f05ed578c9e476a70250d7421fd291b8e20567',
        assets: [5, 1000013],
      },
    },
    blocks: {
      blockA: blocksMeta['4187499'],
      blockB: blocksMeta['4198163'],
    },
  },
  xykPoolHistoricalData: {
    pools: {
      poolA: {
        address:
          '0x4c3f445da74028f47bdcfc66c1c73a6c9f9951c2185f0c3f47e3836494879d17',
        assets: [5, 24],
      },
    },
    blocks: {
      blockA: blocksMeta['4187565'],
      blockB: blocksMeta['4198533'],
    },
  },
  stablepoolHistoricalData: {
    pools: {
      poolA: {
        address:
          '0x22bb00df7706a5965728b60f96406ee59ce675fd5fd10652a4ed6f618856ccfe',
        assets: [10, 18, 21, 23],
      },
    },
    blocks: {
      blockA: blocksMeta['4187519'],
      blockB: blocksMeta['4197907'],
    },
  },
  omnipoolAssetHistoricalData: {
    pools: {
      poolA: {
        address:
          '0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000',
        assets: [5],
      },
    },
    blocks: {
      blockA: blocksMeta['4187514'],
      blockB: blocksMeta['4198517'],
    },
  },
};
