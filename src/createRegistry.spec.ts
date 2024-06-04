// Copyright 2024 Parity Technologies (UK) Ltd.

import fs from 'fs';
import { describe, expect, it, vi } from 'vitest';

import { addParasChainInfoToRelayRegistries } from './addParasChainInfoToRelayRegistries';
import { DEFAULT_REGISTRY, TEST_REGISTRY_FILE_PATH } from './consts';
import { createChainRegistryFromRelay } from './createChainRegistryFromRelay.js';
import { main } from './createRegistry.js';
import { fetchParaIds } from './fetchParaIds';
import { fetchXcAssetsRegistryInfo } from './fetchXcAssetsRegistryInfo';
import { getApi } from './getApi';
import { adjustedMockKusamaRelayApi } from './testHelpers/adjustedMockKusamaRelayApi';
import { adjustedmockPolkadotApi } from './testHelpers/adjustedMockPolkadotRelayApi';
import { TokenRegistry } from './types';

vi.mock('./fetchParaIds', () => {
	return {
		fetchParaIds: vi.fn(),
	};
});
vi.mocked(fetchParaIds)
	.mockResolvedValueOnce({ polkadot: [1000, 1001, 1002, 2030] })
	.mockResolvedValueOnce({ kusama: [1000, 1001, 1002] })
	.mockResolvedValueOnce({ westend: [1000, 1001, 1002] })
	.mockResolvedValueOnce({ rococo: [1000, 1001, 1002] });

vi.mock('./fetchXcAssetsRegistryInfo', () => {
	return {
		fetchXcAssetsRegistryInfo: vi.fn(),
	};
});
vi.mocked(fetchXcAssetsRegistryInfo).mockReturnValue(
	Promise.resolve({
		polkadot: {
			'0': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'polkadot',
			},
			'1000': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'statemint',
			},
			'1001': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1002': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-polkadot',
			},
			'2030': {
				tokens: ['BNC'],
				specName: 'bifrost-polkadot',
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				xcAssetsData: [
					{
						paraID: 0,
						nativeChainID: 'polkadot',
						symbol: 'DOT',
						decimals: 10,
						xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"here":null}}}',
						asset: {
							Token2: '0',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 1000,
						nativeChainID: 'statemint',
						symbol: 'USDT',
						decimals: 6,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
						asset: {
							Token2: '2',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
						],
					},
					{
						paraID: 1000,
						nativeChainID: 'statemint',
						symbol: 'USDC',
						decimals: 6,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1337}]}}}',
						asset: {
							Token2: '5',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
						],
					},
					{
						paraID: 2004,
						nativeChainID: 'moonbeam',
						symbol: 'GLMR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2004},{"palletInstance":10}]}}}',
						asset: {
							Token2: '1',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2004}}}',
						],
					},
					{
						paraID: 2006,
						nativeChainID: 'astar',
						symbol: 'ASTR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x1":{"parachain":2006}}}}',
						asset: {
							Token2: '3',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2006}}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vGLMR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0901"}]}}}',
						asset: {
							VToken2: '1',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vFIL',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0904"}]}}}',
						asset: {
							VToken2: '4',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'FIL',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0804"}]}}}',
						asset: {
							Token2: '4',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vASTR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0903"}]}}}',
						asset: {
							VToken2: '3',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vDOT',
						decimals: 10,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0900"}]}}}',
						asset: {
							VToken2: '0',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vsDOT',
						decimals: 10,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0403"}]}}}',
						asset: {
							VSToken2: '0',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2032,
						nativeChainID: 'interlay',
						symbol: 'IBTC',
						decimals: 8,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0001"}]}}}',
						asset: {
							Token2: '6',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2032"}}}',
						],
					},
					{
						paraID: 2032,
						nativeChainID: 'interlay',
						symbol: 'INTR',
						decimals: 10,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0002"}]}}}',
						asset: {
							Token2: '7',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2032"}}}',
						],
					},
					{
						paraID: 2104,
						nativeChainID: '',
						symbol: 'MANTA',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x1":{"parachain":2104}}}}',
						asset: {
							Token2: '8',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2104"}}}',
						],
					},
				],
			},
		},
		kusama: {
			'0': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'kusama',
			},
			'1000': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'statemine',
			},
			'1001': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1002': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-kusama',
			},
		},
		westend: {
			'0': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'westend',
			},
			'1000': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'westmint',
			},
			'1001': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1002': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-westend',
			},
		},
		rococo: {
			'0': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'rococo',
			},
			'1000': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'statemine',
			},
			'1002': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'contracts-rococo',
			},
			'1003': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1013': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-rococo',
			},
		},
	}),
);

vi.mock('./addParasChainInfoToRelayRegistries', () => {
	return {
		addParasChainInfoToRelayRegistries: vi.fn(),
	};
});
vi.mocked(addParasChainInfoToRelayRegistries).mockResolvedValueOnce({
	polkadot: {
		'1000': {
			tokens: ['DOT'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'statemint',
		},
		'1001': {
			tokens: ['DOT'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'encointer-parachain',
		},
		'1002': {
			tokens: ['DOT'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-polkadot',
		},
		'2030': {
			tokens: ['BNC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bifrost-polkadot',
		},
	},
	kusama: {
		'1000': {
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'statemine',
		},
		'1001': {
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'encointer-parachain',
		},
		'1002': {
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-kusama',
		},
	},
	westend: {
		'1000': {
			tokens: ['WND'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'westmint',
		},
		'1001': {
			tokens: ['WND'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'encointer-parachain',
		},
		'1002': {
			tokens: ['WND'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-westend',
		},
	},
	rococo: {
		'1000': {
			tokens: ['ROC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'statemine',
		},
		'1002': {
			tokens: ['ROC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'contracts-rococo',
		},
		'1003': {
			tokens: ['ROC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'encointer-parachain',
		},
		'1013': {
			tokens: ['ROC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-rococo',
		},
	},
});

vi.mock('./createChainRegistryFromRelay', () => {
	return {
		createChainRegistryFromRelay: vi.fn(),
	};
});
vi.mocked(createChainRegistryFromRelay).mockResolvedValue({
	polkadot: {
		'0': {
			tokens: ['DOT'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'polkadot',
		},
	},
	kusama: {
		'0': {
			tokens: ['KSM'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'kusama',
		},
	},
	westend: {
		'0': {
			tokens: ['WND'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'westend',
		},
	},
	rococo: {
		'0': {
			tokens: ['ROC'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'rococo',
		},
	},
});

vi.mock('./getApi', () => {
	return {
		getApi: vi.fn(),
	};
});
vi.mocked(getApi)
	.mockResolvedValueOnce(adjustedmockPolkadotApi)
	.mockResolvedValueOnce(adjustedMockKusamaRelayApi)
	.mockResolvedValueOnce(adjustedmockPolkadotApi)
	.mockResolvedValueOnce(adjustedMockKusamaRelayApi);

describe('createRegistry', () => {
	it('Should correctly create the Asset Registry', async () => {
		expect(vi.isMockFunction(fetchParaIds)).toBeTruthy();
		expect(vi.isMockFunction(addParasChainInfoToRelayRegistries)).toBeTruthy();
		expect(vi.isMockFunction(createChainRegistryFromRelay)).toBeTruthy();
		expect(vi.isMockFunction(fetchXcAssetsRegistryInfo)).toBeTruthy();
		// expect(await fetchXcAssetsRegistryInfo(DEFAULT_REGISTRY)).toStrictEqual('hello');

		await main(TEST_REGISTRY_FILE_PATH, DEFAULT_REGISTRY);
		const registryData = fs.readFileSync(TEST_REGISTRY_FILE_PATH, 'utf8');
		const createdRegistry = JSON.parse(registryData) as TokenRegistry;

		expect(fetchParaIds).toHaveBeenCalled();
		expect(fetchXcAssetsRegistryInfo).toHaveBeenCalledOnce();
		expect(createChainRegistryFromRelay).toHaveBeenCalledTimes(4);
		expect(addParasChainInfoToRelayRegistries).toHaveBeenCalledTimes(1);
		expect(Object.keys(createdRegistry).length).toBeGreaterThan(0);
		expect(createdRegistry['polkadot']).toEqual({
			'0': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'polkadot',
			},
			'1000': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'statemint',
			},
			'1001': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1002': {
				tokens: ['DOT'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-polkadot',
			},
			'2030': {
				tokens: ['BNC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bifrost-polkadot',
				xcAssetsData: [
					{
						paraID: 0,
						nativeChainID: 'polkadot',
						symbol: 'DOT',
						decimals: 10,
						xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"here":null}}}',
						asset: {
							Token2: '0',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 1000,
						nativeChainID: 'statemint',
						symbol: 'USDT',
						decimals: 6,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1984}]}}}',
						asset: {
							Token2: '2',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
						],
					},
					{
						paraID: 1000,
						nativeChainID: 'statemint',
						symbol: 'USDC',
						decimals: 6,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x3":[{"parachain":1000},{"palletInstance":50},{"generalIndex":1337}]}}}',
						asset: {
							Token2: '5',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
						],
					},
					{
						paraID: 2004,
						nativeChainID: 'moonbeam',
						symbol: 'GLMR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2004},{"palletInstance":10}]}}}',
						asset: {
							Token2: '1',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2004}}}',
						],
					},
					{
						paraID: 2006,
						nativeChainID: 'astar',
						symbol: 'ASTR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x1":{"parachain":2006}}}}',
						asset: {
							Token2: '3',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2006}}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vGLMR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0901"}]}}}',
						asset: {
							VToken2: '1',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vFIL',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0904"}]}}}',
						asset: {
							VToken2: '4',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'FIL',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0804"}]}}}',
						asset: {
							Token2: '4',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vASTR',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0903"}]}}}',
						asset: {
							VToken2: '3',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vDOT',
						decimals: 10,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0900"}]}}}',
						asset: {
							VToken2: '0',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2030,
						nativeChainID: 'bifrost',
						symbol: 'vsDOT',
						decimals: 10,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2030},{"generalKey":"0x0403"}]}}}',
						asset: {
							VSToken2: '0',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"0","Interior":{"Here":""}}',
						],
					},
					{
						paraID: 2032,
						nativeChainID: 'interlay',
						symbol: 'IBTC',
						decimals: 8,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0001"}]}}}',
						asset: {
							Token2: '6',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2032"}}}',
						],
					},
					{
						paraID: 2032,
						nativeChainID: 'interlay',
						symbol: 'INTR',
						decimals: 10,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x2":[{"parachain":2032},{"generalKey":"0x0002"}]}}}',
						asset: {
							Token2: '7',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2032"}}}',
						],
					},
					{
						paraID: 2104,
						nativeChainID: '',
						symbol: 'MANTA',
						decimals: 18,
						xcmV1MultiLocation:
							'{"v1":{"parents":1,"interior":{"x1":{"parachain":2104}}}}',
						asset: {
							Token2: '8',
						},
						reserveLocations: [
							'{"parents":"1","interior":{"X1":{"Parachain":"1000"}}}',
							'{"Parents":"1","Interior":{"X1":{"Parachain":"2104"}}}',
						],
					},
				],
			},
		});
		expect(createdRegistry['kusama']).toEqual({
			'0': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'kusama',
			},
			'1000': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'statemine',
			},
			'1001': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1002': {
				tokens: ['KSM'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-kusama',
			},
		});
		expect(createdRegistry['westend']).toEqual({
			'0': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'westend',
			},
			'1000': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'westmint',
			},
			'1001': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1002': {
				tokens: ['WND'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-westend',
			},
		});
		expect(createdRegistry['rococo']).toEqual({
			'0': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'rococo',
			},
			'1000': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'statemine',
			},
			'1002': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'contracts-rococo',
			},
			'1003': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'encointer-parachain',
			},
			'1013': {
				tokens: ['ROC'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-rococo',
			},
		});
	});
});
