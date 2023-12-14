// Copyright 2023 Parity Technologies (UK) Ltd.

import { fetchXcAssetsRegistryInfo } from './fetchXcAssetRegistryInfo';
import { astarTestXcAssets } from './testHelpers/astarXcAssets';
import { bifrostKusamaTestXcAssets } from './testHelpers/bifrostKusamaXcAssets';
import { moonBeamTestXcAssets } from './testHelpers/moonbeamXcAssets';
import { XcAssets, XcAssetsInfo } from './types';
import { fetchXcAssetData } from './util';

jest.mock('./util');

describe('fetchXcAssetsRegistryInfo', () => {
	it('Should Correctly set xcAssetsData on the Assets Registry', async () => {
		(
			fetchXcAssetData as jest.MockedFunction<
				(cdnUrl: string) => Promise<{
					xcAssets: XcAssets;
				}>
			>
		).mockReturnValueOnce(
			Promise.resolve({
				xcAssets: {
					polkadot: [moonBeamTestXcAssets, astarTestXcAssets],
					kusama: [bifrostKusamaTestXcAssets],
				},
			}),
		);

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
