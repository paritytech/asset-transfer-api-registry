// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';
import type { ChainProperties, Header } from '@polkadot/types/interfaces';

import { mockBifrostKusamaParachainApi } from './mockBifrostKusamaParachainApi';

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockBifrostKusamaParachainApi.registry.createType('Option<u32>', 2);
	});

const getParachainRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockBifrostKusamaParachainApi.registry.createType(
				'Text',
				'bifrost',
			),
			specVersion: mockBifrostKusamaParachainApi.registry.createType(
				'u32',
				2302,
			),
		};
	});

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockBifrostKusamaParachainApi.registry.createType('Header', {
			number: mockBifrostKusamaParachainApi.registry.createType(
				'Compact<BlockNumber>',
				100,
			),
			parentHash: mockBifrostKusamaParachainApi.registry.createType('Hash'),
			stateRoot: mockBifrostKusamaParachainApi.registry.createType('Hash'),
			extrinsicsRoot: mockBifrostKusamaParachainApi.registry.createType('Hash'),
			digest: mockBifrostKusamaParachainApi.registry.createType('Digest'),
		}),
	);

const accountNextIndex = () =>
	mockBifrostKusamaParachainApi.registry.createType('u32', 10);

const disconnect = () => {
	return;
};

const chainProperties = (): Promise<ChainProperties> =>
	Promise.resolve().then(() =>
		mockBifrostKusamaParachainApi.registry.createType('ChainProperties', {
			tokenSymbol: ['BNC'],
		}),
	);

export const adjustedMockBifrostKusamaParachainApi = {
	registry: mockBifrostKusamaParachainApi.registry,
	rpc: {
		state: {
			getRuntimeVersion: getParachainRuntimeVersion,
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
		polkadotXcm: {
			safeXcmVersion: getSystemSafeXcmVersion,
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets:
				mockBifrostKusamaParachainApi.tx['polkadotXcm']
					.limitedReserveTransferAssets,
			reserveTransferAssets:
				mockBifrostKusamaParachainApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets:
				mockBifrostKusamaParachainApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets:
				mockBifrostKusamaParachainApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
		xTokens: {
			transferMultiasset:
				mockBifrostKusamaParachainApi.tx['xTokens'].transferMultiasset,
			transferMultiassetWithFee:
				mockBifrostKusamaParachainApi.tx['xTokens'].transferMultiassetWithFee,
			transferMultiassets:
				mockBifrostKusamaParachainApi.tx['xTokens'].transferMultiassets,
		},
	},
	runtimeVersion: {
		transactionVersion: mockBifrostKusamaParachainApi.registry.createType(
			'u32',
			4,
		),
		specVersion: mockBifrostKusamaParachainApi.registry.createType('u32', 2302),
	},
	disconnect: disconnect,
	genesisHash: mockBifrostKusamaParachainApi.registry.createType('BlockHash'),
} as unknown as ApiPromise;
