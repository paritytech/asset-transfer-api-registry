// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import type { Header } from '@polkadot/types/interfaces';
import { ChainProperties } from '@polkadot/types/interfaces';

import { mockPolkadotApi } from './mockPolkadotRelayApi';

const getRelaySafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockPolkadotApi.registry.createType('Option<u32>', 2);
	});

const getRelayRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockPolkadotApi.registry.createType('Text', 'polkadot'),
			specVersion: mockPolkadotApi.registry.createType('u32', 9420),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockPolkadotApi.registry.createType('Header', {
			number: mockPolkadotApi.registry.createType('Compact<BlockNumber>', 100),
			parentHash: mockPolkadotApi.registry.createType('Hash'),
			stateRoot: mockPolkadotApi.registry.createType('Hash'),
			extrinsicsRoot: mockPolkadotApi.registry.createType('Hash'),
			digest: mockPolkadotApi.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () => mockPolkadotApi.registry.createType('u32', 10);
const parachains = () => {
	return mockPolkadotApi.registry.createType(
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
		mockPolkadotApi.registry.createType('ChainProperties', {
			tokenSymbol: ['DOT'],
		}),
	);

export const adjustedmockPolkadotApi = {
	registry: mockPolkadotApi.registry,
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
				mockPolkadotApi.tx['xcmPallet'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockPolkadotApi.tx['xcmPallet'].reserveTransferAssets,
			teleportAssets: mockPolkadotApi.tx['xcmPallet'].teleportAssets,
			limitedTeleportAssets:
				mockPolkadotApi.tx['xcmPallet'].limitedTeleportAssets,
		},
		balances: {
			transfer: mockPolkadotApi.tx.balances.transfer,
			transferKeepAlive: mockPolkadotApi.tx.balances.transferKeepAlive,
		},
	},
	runtimeVersion: {
		transactionVersion: mockPolkadotApi.registry.createType('u32', 4),
		specVersion: mockPolkadotApi.registry.createType('u32', 9420),
	},
	genesisHash: mockPolkadotApi.registry.createType('BlockHash'),
	disconnect: disconnect,
} as unknown as ApiPromise;
