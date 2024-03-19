// Copyright 2023 Parity Technologies (UK) Ltd.

import { jest } from '@jest/globals'

import { fetchXcAssetsRegistryInfo } from './fetchXcAssetRegistryInfo.js';
import { astarTestXcAssets } from './testHelpers/astarXcAssets.js';
import { bifrostKusamaTestXcAssets } from './testHelpers/bifrostKusamaXcAssets.js';
import { moonBeamTestXcAssets } from './testHelpers/moonbeamXcAssets.js';
import type { XcAssetsInfo } from './types.js';

jest.useFakeTimers()

jest.mock('./util', () => ({
	fetchXcAssetData: jest.fn(() => Promise.resolve({
		xcAssets: {
			polkadot: [moonBeamTestXcAssets, astarTestXcAssets],
			kusama: [bifrostKusamaTestXcAssets],
		},
	}),)
}));

describe('fetchXcAssetsRegistryInfo', () => {
	it('Should Correctly set xcAssetsData on the Assets Registry', async () => {
		const registry = {
			polkadot: {
				'2004': {
					tokens: ['GLMR'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'moonbeam',
				},
				'2006': {
					tokens: ['ASTR'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'astar',
				},
			},
			kusama: {
				'2001': {
					tokens: [
						'BNC',
						'KUSD',
						'DOT',
						'KSM',
						'KAR',
						'ZLK',
						'PHA',
						'RMRK',
						'MOVR',
					],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'bifrost',
				},
			},
			westend: {},
			rococo: {},
		};

		await fetchXcAssetsRegistryInfo(registry);

		expect(
			(registry['polkadot']['2004']['xcAssetsData'] as XcAssetsInfo[])[0][
				'nativeChainID'
			],
		).toEqual('polkadot');
		expect(
			(registry['polkadot']['2006']['xcAssetsData'] as XcAssetsInfo[])[0][
				'nativeChainID'
			],
		).toEqual('polkadot');
		expect(
			(registry['kusama']['2001']['xcAssetsData'] as XcAssetsInfo[])[0][
				'nativeChainID'
			],
		).toEqual('kusama');
	});
});
