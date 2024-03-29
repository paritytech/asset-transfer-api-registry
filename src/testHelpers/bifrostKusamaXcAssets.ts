export const bifrostKusamaTestXcAssets = {
	relayChain: 'kusama',
	paraID: 2001,
	id: 'bifrost',
	xcAssetCnt: '17',
	data: [
		{
			paraID: 0,
			relayChain: 'kusama',
			nativeChainID: 'kusama',
			symbol: 'KSM',
			decimals: 12,
			interiorType: 'here',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				'here',
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						here: null,
					},
				},
			},
			asset: {
				Token: 'KSM',
			},
			source: ['2001'],
		},
		{
			paraID: 1000,
			relayChain: 'kusama',
			nativeChainID: 'statemine',
			symbol: 'RMRK',
			decimals: 10,
			interiorType: 'x3',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 1000,
				},
				{
					palletInstance: 50,
				},
				{
					generalIndex: 8,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x3: [
							{
								parachain: 1000,
							},
							{
								palletInstance: 50,
							},
							{
								generalIndex: 8,
							},
						],
					},
				},
			},
			asset: {
				Token: 'RMRK',
			},
			source: ['2001'],
		},
		{
			paraID: 1000,
			relayChain: 'kusama',
			nativeChainID: 'statemine',
			symbol: 'USDT',
			decimals: 6,
			interiorType: 'x3',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 1000,
				},
				{
					palletInstance: 50,
				},
				{
					generalIndex: 1984,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x3: [
							{
								parachain: 1000,
							},
							{
								palletInstance: 50,
							},
							{
								generalIndex: 1984,
							},
						],
					},
				},
			},
			asset: {
				Token2: '0',
			},
			source: ['2001'],
		},
		{
			paraID: 2000,
			relayChain: 'kusama',
			nativeChainID: 'karura',
			symbol: 'KUSD',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2000,
				},
				{
					generalKey: '0x0081',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2000,
							},
							{
								generalKey: '0x0081',
							},
						],
					},
				},
			},
			asset: {
				Stable: 'KUSD',
			},
			source: ['2001'],
		},
		{
			paraID: 2000,
			relayChain: 'kusama',
			nativeChainID: 'karura',
			symbol: 'KAR',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2000,
				},
				{
					generalKey: '0x0080',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2000,
							},
							{
								generalKey: '0x0080',
							},
						],
					},
				},
			},
			asset: {
				Token: 'KAR',
			},
			source: ['2001'],
		},
		{
			paraID: 2001,
			relayChain: 'kusama',
			nativeChainID: 'bifrost',
			symbol: 'vBNC',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2001,
				},
				{
					generalKey: '0x0101',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2001,
							},
							{
								generalKey: '0x0101',
							},
						],
					},
				},
			},
			asset: {
				VToken: 'BNC',
			},
			source: ['2001'],
		},
		{
			paraID: 2001,
			relayChain: 'kusama',
			nativeChainID: 'bifrost',
			symbol: 'vMOVR',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2001,
				},
				{
					generalKey: '0x010a',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2001,
							},
							{
								generalKey: '0x010a',
							},
						],
					},
				},
			},
			asset: {
				VToken: 'MOVR',
			},
			source: ['2001'],
		},
		{
			paraID: 2001,
			relayChain: 'kusama',
			nativeChainID: 'bifrost',
			symbol: 'vKSM',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2001,
				},
				{
					generalKey: '0x0104',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2001,
							},
							{
								generalKey: '0x0104',
							},
						],
					},
				},
			},
			asset: {
				VToken: 'KSM',
			},
			source: ['2001'],
		},
		{
			paraID: 2001,
			relayChain: 'kusama',
			nativeChainID: 'bifrost',
			symbol: 'ZLK',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2001,
				},
				{
					generalKey: '0x0207',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2001,
							},
							{
								generalKey: '0x0207',
							},
						],
					},
				},
			},
			asset: {
				Token: 'ZLK',
			},
			source: ['2001'],
		},
		{
			paraID: 2001,
			relayChain: 'kusama',
			nativeChainID: 'bifrost',
			symbol: 'VSvsKSM',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2001,
				},
				{
					generalKey: '0x0404',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2001,
							},
							{
								generalKey: '0x0404',
							},
						],
					},
				},
			},
			asset: {
				VSToken: 'KSM',
			},
			source: ['2001'],
		},
		{
			paraID: 2001,
			relayChain: 'kusama',
			nativeChainID: 'bifrost',
			symbol: 'BNC',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2001,
				},
				{
					generalKey: '0x0001',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2001,
							},
							{
								generalKey: '0x0001',
							},
						],
					},
				},
			},
			asset: {
				Native: 'BNC',
			},
			source: ['2001'],
		},
		{
			paraID: 2004,
			relayChain: 'kusama',
			nativeChainID: 'khala',
			symbol: 'PHA',
			decimals: 12,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2004,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2004,
						},
					},
				},
			},
			asset: {
				Token: 'PHA',
			},
			source: ['2001'],
		},
		{
			paraID: 2007,
			relayChain: 'kusama',
			nativeChainID: 'shiden',
			symbol: 'SDN',
			decimals: 18,
			interiorType: 'x1',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2007,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x1: {
							parachain: 2007,
						},
					},
				},
			},
			asset: {
				Token2: '3',
			},
			source: ['2001'],
		},
		{
			paraID: 2023,
			relayChain: 'kusama',
			nativeChainID: 'moonriver',
			symbol: 'MOVR',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2023,
				},
				{
					palletInstance: 10,
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2023,
							},
							{
								palletInstance: 10,
							},
						],
					},
				},
			},
			asset: {
				Token: 'MOVR',
			},
			source: ['2001'],
		},
		{
			paraID: 2092,
			relayChain: 'kusama',
			nativeChainID: 'kintsugi',
			symbol: 'KBTC',
			decimals: 8,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2092,
				},
				{
					generalKey: '0x000b',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2092,
							},
							{
								generalKey: '0x000b',
							},
						],
					},
				},
			},
			asset: {
				Token2: '2',
			},
			source: ['2001'],
		},
		{
			paraID: 2092,
			relayChain: 'kusama',
			nativeChainID: 'kintsugi',
			symbol: 'KINT',
			decimals: 12,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2092,
				},
				{
					generalKey: '0x000c',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2092,
							},
							{
								generalKey: '0x000c',
							},
						],
					},
				},
			},
			asset: {
				Token2: '1',
			},
			source: ['2001'],
		},
		{
			paraID: 2110,
			relayChain: 'kusama',
			nativeChainID: 'mangata',
			symbol: 'MGX',
			decimals: 18,
			interiorType: 'x2',
			xcmV1Standardized: [
				{
					network: 'kusama',
				},
				{
					parachain: 2110,
				},
				{
					generalKey: '0x00000000',
				},
			],
			xcmV1MultiLocation: {
				v1: {
					parents: 1,
					interior: {
						x2: [
							{
								parachain: 2110,
							},
							{
								generalKey: '0x00000000',
							},
						],
					},
				},
			},
			asset: {
				Token2: '4',
			},
			source: ['2001'],
		},
	],
};
