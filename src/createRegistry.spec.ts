// Copyright 2024 Parity Technologies (UK) Ltd.

import fs from 'fs';
import { describe, expect, it, vi } from 'vitest';

import { addParasChainInfoToRelayRegistries } from './addParasChainInfoToRelayRegistries';
import { DEFAULT_REGISTRY, TEST_REGISTRY_FILE_PATH } from './consts';
import { createChainRegistryFromRelay } from './createChainRegistryFromRelay.js';
import { main } from './createRegistry.js';
import { fetchParaIds } from './fetchParaIds';
import { fetchParaspellRegistryInfo } from './fetchParaspellRegistry.js';
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
	.mockResolvedValueOnce({ paseo: [1000, 1002, 1003, 1004, 1005] });

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
	paseo: {
		'1000': {
			tokens: ['PAS'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'asset-hub-paseo',
		},
		'1002': {
			tokens: ['PAS'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'bridge-hub-paseo',
		},
		'1004': {
			tokens: ['PAS'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'people-paseo',
		},
		'1005': {
			tokens: ['PAS'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'coretime-paseo',
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
	paseo: {
		'0': {
			tokens: ['PAS'],
			assetsInfo: {},
			foreignAssetsInfo: {},
			poolPairsInfo: {},
			specName: 'paseo',
		},
	},
});

vi.mock('./fetchParaspellRegistry', () => {
	return {
		fetchParaspellRegistryInfo: vi.fn(),
	};
});
vi.mocked(fetchParaspellRegistryInfo).mockImplementation((registry) => {
	// Return the registry unchanged for test purposes
	return Promise.resolve(registry);
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

		await main(TEST_REGISTRY_FILE_PATH, DEFAULT_REGISTRY);
		const registryData = fs.readFileSync(TEST_REGISTRY_FILE_PATH, 'utf8');
		const createdRegistry = JSON.parse(registryData) as TokenRegistry;

		expect(fetchParaIds).toHaveBeenCalled();
		expect(createChainRegistryFromRelay).toHaveBeenCalledTimes(4);
		expect(addParasChainInfoToRelayRegistries).toHaveBeenCalledTimes(1);
		expect(Object.keys(createdRegistry).length).toBeGreaterThan(0);
		expect(createdRegistry['polkadot']).toEqual({
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
		});
		expect(createdRegistry['kusama']).toEqual({
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
		expect(createdRegistry['paseo']).toEqual({
			'1000': {
				tokens: ['PAS'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'asset-hub-paseo',
			},
			'1002': {
				tokens: ['PAS'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'bridge-hub-paseo',
			},
			'1004': {
				tokens: ['PAS'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'people-paseo',
			},
			'1005': {
				tokens: ['PAS'],
				assetsInfo: {},
				foreignAssetsInfo: {},
				poolPairsInfo: {},
				specName: 'coretime-paseo',
			},
		});
	});
});
