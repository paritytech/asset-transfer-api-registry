// Copyright 2023 Parity Technologies (UK) Ltd.
// tslint:disable

import { EndpointOption } from '@polkadot/apps-config/endpoints/types';
import fs from 'fs';

import { BASE_REGISTRY, TEST_REGISTRY_FILE_PATH } from './consts';
import { createChainRegistryFromParas } from './createChainRegistryFromParas';
import { createChainRegistryFromRelay } from './createChainRegistryFromRelay';
import { main } from './createRegistry';
import { fetchParaIds } from './fetchParaIds';
import { fetchXcAssetsRegistryInfo } from './fetchXcAssetRegistryInfo';
import { ChainName, ParaIds, TokenRegistry } from './types';
const registry = BASE_REGISTRY;

jest.mock('./fetchParaIds');
jest.mock('./fetchXcAssetRegistryInfo');
(
	fetchXcAssetsRegistryInfo as jest.MockedFunction<
		(registry: TokenRegistry) => Promise<void>
	>
).mockReturnValueOnce(
	Promise.resolve([
		{
			paraID: 0,
			nativeChainID: 'polkadot',
			symbol: 'DOT',
			decimals: 10,
			xcmV1MultiLocation: '{"v1":{"parents":1,"interior":{"here":null}}}',
			asset: {
				Token2: '0',
			},
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
		},
	]).then((res) => {
		registry['polkadot']['2030']['xcAssetsData'] = res;
	}),
);
jest.mock('./createChainRegistryFromRelay');

/* eslint-disable */
jest.mock('./createChainRegistryFromParas', () => {
	const createChainRegistryFromParasModule = jest.requireActual(
		'./createChainRegistryFromParas',
	);
	return {
		...createChainRegistryFromParasModule,
		createChainRegistryFromParas: jest
			.fn()
			.mockReturnValueOnce(
				Promise.resolve({
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
				}).then((res) => {
					registry['polkadot']['1000'] = res['1000'];
					registry['polkadot']['1001'] = res['1001'];
					registry['polkadot']['1002'] = res['1002'];
					registry['polkadot']['2030'] = res['2030'];
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
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
				}).then((res) => {
					registry['kusama']['1000'] = res['1000'];
					registry['kusama']['1001'] = res['1001'];
					registry['kusama']['1002'] = res['1002'];
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
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
				}).then((res) => {
					registry['westend']['1000'] = res['1000'];
					registry['westend']['1001'] = res['1001'];
					registry['westend']['1002'] = res['1002'];
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
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
				}).then((res) => {
					registry['rococo']['1000'] = res['1000'];
					registry['rococo']['1002'] = res['1002'];
					registry['rococo']['1003'] = res['1003'];
					registry['rococo']['1013'] = res['1013'];
				}),
			),
	};
});

describe('createRegistry', () => {
	it('Should correctly create the Asset Registry', async () => {
		(
			fetchParaIds as jest.MockedFunction<
				(
					chain: string,
					endpointOpts: EndpointOption,
					paraIds: ParaIds,
				) => Promise<ParaIds>
			>
		)
			.mockResolvedValueOnce({
				polkadot: [1000, 1001, 1002, 2030],
			})
			.mockResolvedValueOnce({
				kusama: [1000, 1001, 1002],
			})
			.mockResolvedValueOnce({
				westend: [1000, 1001, 1002],
			})
			.mockResolvedValueOnce({
				rococo: [1000, 1001, 1002],
			});

		(
			createChainRegistryFromRelay as jest.MockedFunction<
				(
					chainName: ChainName,
					endpoint: EndpointOption,
					registry: TokenRegistry,
				) => Promise<void>
			>
		)
			.mockReturnValueOnce(
				Promise.resolve({
					tokens: ['DOT'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'polkadot',
				}).then((res) => {
					registry['polkadot']['0'] = res;
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
					tokens: ['KSM'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'kusama',
				}).then((res) => {
					registry['kusama']['0'] = res;
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
					tokens: ['WND'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'westend',
				}).then((res) => {
					registry['westend']['0'] = res;
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
					tokens: ['ROC'],
					assetsInfo: {},
					foreignAssetsInfo: {},
					poolPairsInfo: {},
					specName: 'rococo',
				}).then((res) => {
					registry['rococo']['0'] = res;
				}),
			);

		const currentRegistry: TokenRegistry = {
			polkadot: {},
			kusama: {},
			westend: {},
			rococo: {},
		};

		await main(TEST_REGISTRY_FILE_PATH, registry, currentRegistry);
		const registryData = fs.readFileSync(TEST_REGISTRY_FILE_PATH, 'utf8');
		const createdRegistry = JSON.parse(registryData) as TokenRegistry;
		expect(createChainRegistryFromRelay).toHaveBeenCalledTimes(4);
		expect(createChainRegistryFromParas).toHaveBeenCalledTimes(8);
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
