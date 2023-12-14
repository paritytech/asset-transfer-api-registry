// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';
import { ChainProperties } from '@polkadot/types/interfaces';

import { mockKusamaRelayApi } from './mockKusamaRelayApi';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockKusamaRelayApi.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockKusamaRelayApi.registry.createType('Text', 'kusama'),
			specVersion: mockKusamaRelayApi.registry.createType('u32', 9420),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockKusamaRelayApi.registry.createType('Header', {
			number: mockKusamaRelayApi.registry.createType(
				'Compact<BlockNumber>',
				100,
			),
			parentHash: mockKusamaRelayApi.registry.createType('Hash'),
			stateRoot: mockKusamaRelayApi.registry.createType('Hash'),
			extrinsicsRoot: mockKusamaRelayApi.registry.createType('Hash'),
			digest: mockKusamaRelayApi.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () =>
	mockKusamaRelayApi.registry.createType('u32', 10);
const parachains = () => {
	return mockKusamaRelayApi.registry.createType(
		'Vec<u32>',
		[
			1000, 1001, 1002, 2000, 2001, 2004, 2007, 2011, 2012, 2015, 2023, 2024,
			2048, 2084, 2085, 2087, 2088, 2090, 2092, 2095, 2096, 2105, 2106, 2110,
			2113, 2114, 2119, 2121, 2123, 2124, 2125, 2222, 2236, 2239, 2241, 2257,
			2261, 2274, 2275, 2281, 2284, 3334, 3335,
		],
	);
};
const disconnect = () => {
	return;
};

const chainProperties = (): Promise<ChainProperties> =>
	Promise.resolve().then(() =>
		mockKusamaRelayApi.registry.createType('ChainProperties', {
			tokenSymbol: ['KSM'],
		}),
	);

export const adjustedMockKusamaRelayApi = {
	registry: mockKusamaRelayApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getRelayRuntimeVersion,
		},
		system: {
			accountNextIndex: accountNextIndex,
			properties: chainProperties,
		},
		chain: {
			getHeader: getHeader,
		},
	},
	query: {
		paras: {
			parachains: parachains,
		},
		xcmPallet: {
			safeXcmVersion: getRelaySafeXcmVersion,
		},
	},
	tx: {
		xcmPallet: {
			limitedReserveTransferAssets:
				mockKusamaRelayApi.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockKusamaRelayApi.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockKusamaRelayApi.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets:
				mockKusamaRelayApi.tx['xcmPallet'].limitedTeleportAssets,
		},
		balances: {
			transfer: mockKusamaRelayApi.tx.balances.transfer,
			transferKeepAlive: mockKusamaRelayApi.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockKusamaRelayApi.registry.createType('u32', 4),
		specVersion: mockKusamaRelayApi.registry.createType('u32', 9420),
	},
	genesisHash: mockKusamaRelayApi.registry.createType('BlockHash'),
	disconnect: disconnect,
} as unknown as ApiPromise;
