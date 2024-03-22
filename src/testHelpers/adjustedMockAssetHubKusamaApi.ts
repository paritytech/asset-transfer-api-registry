// Copyright 2023 Parity Technologies (UK) Ltd.

import type { ApiPromise } from '@polkadot/api';
import {
	Metadata,
	Option,
	StorageKey,
	TypeRegistry,
	u32,
} from '@polkadot/types';
import type { ChainProperties, Header } from '@polkadot/types/interfaces';
import type {
	PalletAssetConversionEvent,
	PalletAssetConversionPoolInfo,
	PalletAssetsAssetDetails,
	PalletAssetsAssetMetadata,
} from '@polkadot/types/lookup';
import type { AnyJson, AnyTuple } from '@polkadot/types-codec/types';
import { ITuple } from '@polkadot/types-codec/types';
import { getSpecTypes } from '@polkadot/types-known';
import BN from 'bn.js';

import type { UnionXcmMultiLocation } from '../types';
import { assetHubKusamaV10400 } from './metadata/assetHubKusamaV10400';
import { mockAssetHubKusamaApi } from './mockAssetHubKusamaApi';
import { mockWeightInfo } from './mockWeightInfo';
/**
 * Create a type registry for Statemine.
 * Useful for creating types in order to facilitate testing.
 *
 * @param specVersion Statemine runtime spec version to get type defs for.
 */
function createStatemineRegistry(specVersion: number): TypeRegistry {
	const registry = new TypeRegistry();

	registry.setChainProperties(
		registry.createType('ChainProperties', {
			ss58Format: 2,
			tokenDecimals: 12,
			tokenSymbol: 'KSM',
		}),
	);

	registry.register(
		getSpecTypes(registry, 'Statemine', 'statemine', specVersion),
	);

	registry.setMetadata(new Metadata(registry, assetHubKusamaV10400));

	return registry;
}
const getSystemRuntimeVersion = () =>
	Promise.resolve().then(() => {
		return {
			specName: mockAssetHubKusamaApi.registry.createType(
				'Text',
				'asset-hub-kusama',
			),
			specVersion: mockAssetHubKusamaApi.registry.createType('u32', 9435),
		};
	});

const getSystemSafeXcmVersion = () =>
	Promise.resolve().then(() => {
		return mockAssetHubKusamaApi.registry.createType('Option<u32>', 2);
	});

const queryInfoCallAt = () =>
	Promise.resolve().then(() =>
		mockAssetHubKusamaApi.createType('RuntimeDispatchInfoV2', mockWeightInfo),
	);

const getMetadata = () =>
	Promise.resolve().then(() =>
		mockAssetHubKusamaApi.registry.createType('Metadata', assetHubKusamaV10400),
	);

const getHeader = (): Promise<Header> =>
	Promise.resolve().then(() =>
		mockAssetHubKusamaApi.registry.createType('Header', {
			number: mockAssetHubKusamaApi.registry.createType(
				'Compact<BlockNumber>',
				100,
			),
			parentHash: mockAssetHubKusamaApi.registry.createType('Hash'),
			stateRoot: mockAssetHubKusamaApi.registry.createType('Hash'),
			extrinsicsRoot: mockAssetHubKusamaApi.registry.createType('Hash'),
			digest: mockAssetHubKusamaApi.registry.createType('Digest'),
		}),
	);

const createType = mockAssetHubKusamaApi.registry.createType.bind(
	mockAssetHubKusamaApi,
);
const accountNextIndex = () =>
	mockAssetHubKusamaApi.registry.createType('u32', 10);

const disconnect = () => {
	return;
};

const chainProperties = (): Promise<ChainProperties> =>
	Promise.resolve().then(() =>
		mockAssetHubKusamaApi.registry.createType('ChainProperties', {
			tokenSymbol: ['KSM'],
		}),
	);

const multiLocationAssetInfo = {
	owner: mockAssetHubKusamaApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	issuer: mockAssetHubKusamaApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	admin: mockAssetHubKusamaApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	freezer: mockAssetHubKusamaApi.registry.createType(
		'AccountId32',
		'0x0987654309876543098765430987654309876543098765430987654309876543',
	),
	supply: mockAssetHubKusamaApi.registry.createType('u128', 100),
	deposit: mockAssetHubKusamaApi.registry.createType('u128', 100),
	minBalance: mockAssetHubKusamaApi.registry.createType('u128', 100),
	isSufficient: mockAssetHubKusamaApi.registry.createType('bool', true),
	accounts: mockAssetHubKusamaApi.registry.createType('u32', 100),
	sufficients: mockAssetHubKusamaApi.registry.createType('u32', 100),
	approvals: mockAssetHubKusamaApi.registry.createType('u32', 100),
	status: mockAssetHubKusamaApi.registry.createType(
		'PalletAssetsAssetStatus',
		'live',
	),
};

const asset = (
	assetId: number | string | BN,
): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<number, PalletAssetsAssetDetails> = new Map();

		const insufficientAssetInfo = {
			owner: mockAssetHubKusamaApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			issuer: mockAssetHubKusamaApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			admin: mockAssetHubKusamaApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			freezer: mockAssetHubKusamaApi.registry.createType(
				'AccountId32',
				'0x0987654309876543098765430987654309876543098765430987654309876543',
			),
			supply: mockAssetHubKusamaApi.registry.createType('u128', 100),
			deposit: mockAssetHubKusamaApi.registry.createType('u128', 100),
			minBalance: mockAssetHubKusamaApi.registry.createType('u128', 100),
			isSufficient: mockAssetHubKusamaApi.registry.createType('bool', false),
			accounts: mockAssetHubKusamaApi.registry.createType('u32', 100),
			sufficients: mockAssetHubKusamaApi.registry.createType('u32', 100),
			approvals: mockAssetHubKusamaApi.registry.createType('u32', 100),
			status: mockAssetHubKusamaApi.registry.createType(
				'PalletAssetsAssetStatus',
				'live',
			),
		};
		const insufficientAsset = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetDetails',
			insufficientAssetInfo,
		);
		assets.set(100, insufficientAsset);

		const sufficientAsset = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo,
		);
		assets.set(1984, sufficientAsset);

		const adjAsset = BN.isBN(assetId)
			? assetId.toNumber()
			: typeof assetId === 'string'
			  ? Number.parseInt(assetId)
			  : assetId;
		const maybeAsset = assets.has(adjAsset) ? assets.get(adjAsset) : undefined;

		if (maybeAsset) {
			return new Option(
				createStatemineRegistry(9435),
				'PalletAssetsAssetDetails',
				maybeAsset,
			);
		}

		return mockAssetHubKusamaApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined,
		);
	});

const assetsMetadata = (
	assetId: number | string | BN,
): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<number, PalletAssetsAssetMetadata> = new Map();

		const rawUSDtMetadata = {
			deposit: mockAssetHubKusamaApi.registry.createType('u128', 0),
			name: mockAssetHubKusamaApi.registry.createType('Bytes', '0x78634b534d'),
			symbol: Object.assign(
				mockAssetHubKusamaApi.registry.createType('Bytes', '0x78634b534d'),
				{
					toHuman: () => 'USDt',
				},
			),
			decimals: mockAssetHubKusamaApi.registry.createType('u8', 12),
			isFrozen: mockAssetHubKusamaApi.registry.createType('bool', false),
		};
		const usdtMetadata = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawUSDtMetadata,
		);
		metadata.set(1984, usdtMetadata);

		const adjAsset = BN.isBN(assetId)
			? assetId.toNumber()
			: typeof assetId === 'string'
			  ? Number.parseInt(assetId)
			  : assetId;
		const maybeMetadata = metadata.has(adjAsset)
			? metadata.get(adjAsset)
			: undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetMetadata',
			{},
		);
	});

const foreignAsset = (
	asset: UnionXcmMultiLocation,
): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const assetsMutliLocation = mockAssetHubKusamaApi.registry.createType(
			'XcmV2MultiLocation',
			asset,
		);
		const multiLocationStr =
			'{"parents":"1","interior":{"X2": [{"Parachain":"2125"}, {"GeneralIndex": "0"}]}}';
		const multiLocation = mockAssetHubKusamaApi.registry.createType(
			'XcmV2MultiLocation',
			JSON.parse(multiLocationStr),
		);
		const multiLocationAsset = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo,
		);
		assets.set(multiLocation.toHex(), multiLocationAsset);

		const maybeAsset = assets.has(assetsMutliLocation.toHex())
			? assets.get(assetsMutliLocation.toHex())
			: undefined;

		if (maybeAsset) {
			return new Option(
				createStatemineRegistry(9435),
				'PalletAssetsAssetDetails',
				maybeAsset,
			);
		}

		return mockAssetHubKusamaApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined,
		);
	});

const foreignAssetsMetadata = (
	assetId: UnionXcmMultiLocation,
): Promise<PalletAssetsAssetMetadata> =>
	Promise.resolve().then(() => {
		const metadata: Map<string, PalletAssetsAssetMetadata> = new Map();
		const assetIdMultiLocation = mockAssetHubKusamaApi.registry.createType(
			'XcmV2MultiLocation',
			assetId,
		);

		const rawTnkrMultiLocationMetadata = {
			deposit: mockAssetHubKusamaApi.registry.createType('u128', 6693666633),
			name: mockAssetHubKusamaApi.registry.createType(
				'Bytes',
				'0x54696e6b65726e6574',
			),
			symbol: Object.assign(
				mockAssetHubKusamaApi.registry.createType('Bytes', '0x544e4b52'),
				{
					toHuman: () => 'TNKR',
				},
			),
			decimals: mockAssetHubKusamaApi.registry.createType('u8', 12),
			isFrozen: mockAssetHubKusamaApi.registry.createType('bool', false),
		};
		const tnkrForeignAssetMetadata = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetMetadata',
			rawTnkrMultiLocationMetadata,
		);
		const multiLocation = mockAssetHubKusamaApi.registry.createType(
			'XcmV2MultiLocation',
			{
				parents: '1',
				interior: { X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }] },
			},
		);
		metadata.set(multiLocation.toHex(), tnkrForeignAssetMetadata);

		const maybeMetadata = metadata.has(assetIdMultiLocation.toHex())
			? metadata.get(assetIdMultiLocation.toHex())
			: undefined;

		if (maybeMetadata) {
			return maybeMetadata;
		}

		return mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetMetadata',
			{},
		);
	});

const poolAsset = (asset: string): Promise<Option<PalletAssetsAssetDetails>> =>
	Promise.resolve().then(() => {
		const assets: Map<string, PalletAssetsAssetDetails> = new Map();
		const multiLocationAsset = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetsAssetDetails',
			multiLocationAssetInfo,
		);

		assets.set('0', multiLocationAsset);

		const maybeAsset = assets.has(asset) ? assets.get(asset) : undefined;

		if (maybeAsset) {
			return new Option(
				createStatemineRegistry(9435),
				'PalletAssetsAssetDetails',
				maybeAsset,
			);
		}

		return mockAssetHubKusamaApi.registry.createType(
			'Option<PalletAssetsAssetDetails>',
			undefined,
		);
	});

const pools = (
	_arg: ITuple<[PalletAssetConversionEvent, PalletAssetConversionEvent]>,
): Promise<[PalletAssetConversionEvent, PalletAssetConversionPoolInfo]> =>
	Promise.resolve().then(() => {
		const palletAssetConversionNativeOrAssetId =
			mockAssetHubKusamaApi.registry.createType('PalletAssetConversionEvent', [
				{ parents: 0, interior: { Here: '' } },
				{
					parents: 0,
					interior: { X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }] },
				},
			]);

		const poolInfo = mockAssetHubKusamaApi.registry.createType(
			'PalletAssetConversionPoolInfo',
			{
				lpToken: 0,
			},
		);

		return [palletAssetConversionNativeOrAssetId, poolInfo];
	});

const mockApiAt = {
	call: {
		transactionPaymentApi: {
			queryInfo: queryInfoCallAt,
		},
	},
};

export const adjustedmockAssetHubKusamaApi = {
	createType: createType,
	registry: createStatemineRegistry(9435),
	rpc: {
		state: {
			getRuntimeVersion: getSystemRuntimeVersion,
			getMetadata: getMetadata,
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
		assets: {
			asset: Object.assign(asset, {
				entries: (): [
					StorageKey<[u32]>,
					Option<PalletAssetsAssetDetails>,
				][] => {
					const assets: Map<
						StorageKey<[u32]>,
						Option<PalletAssetsAssetDetails>
					> = new Map();

					const USDtAssetInfo = {
						owner: mockAssetHubKusamaApi.registry.createType(
							'AccountId32',
							'0x0987654309876543098765430987654309876543098765430987654309876543',
						),
						issuer: mockAssetHubKusamaApi.registry.createType(
							'AccountId32',
							'0x0987654309876543098765430987654309876543098765430987654309876543',
						),
						admin: mockAssetHubKusamaApi.registry.createType(
							'AccountId32',
							'0x0987654309876543098765430987654309876543098765430987654309876543',
						),
						freezer: mockAssetHubKusamaApi.registry.createType(
							'AccountId32',
							'0x0987654309876543098765430987654309876543098765430987654309876543',
						),
						supply: mockAssetHubKusamaApi.registry.createType('u128', 100),
						deposit: mockAssetHubKusamaApi.registry.createType('u128', 100),
						minBalance: mockAssetHubKusamaApi.registry.createType('u128', 100),
						isSufficient: mockAssetHubKusamaApi.registry.createType(
							'bool',
							true,
						),
						accounts: mockAssetHubKusamaApi.registry.createType('u32', 100),
						sufficients: mockAssetHubKusamaApi.registry.createType('u32', 100),
						approvals: mockAssetHubKusamaApi.registry.createType('u32', 100),
						status: mockAssetHubKusamaApi.registry.createType(
							'PalletAssetsAssetStatus',
							'live',
						),
					};
					const USDtAssetDetails = mockAssetHubKusamaApi.registry.createType(
						'Option<PalletAssetsAssetDetails>',
						USDtAssetInfo,
					);
					const assetId = mockAssetHubKusamaApi.registry.createType(
						'u32',
						1984,
					);
					const storageKey = { args: [assetId] } as StorageKey<[u32]>;
					Object.assign(storageKey, {
						toHuman: (): AnyJson => {
							return [1984];
						},
					});
					assets.set(storageKey, USDtAssetDetails);

					const result: [
						StorageKey<[u32]>,
						Option<PalletAssetsAssetDetails>,
					][] = [];
					assets.forEach((val, key) => {
						result.push([key, val]);
					});

					return result;
				},
			}),
			metadata: assetsMetadata,
		},
		foreignAssets: {
			asset: Object.assign(foreignAsset, {
				entries: (): [StorageKey<AnyTuple>, PalletAssetsAssetDetails][] => {
					const metadata: Map<
						StorageKey<AnyTuple>,
						PalletAssetsAssetDetails
					> = new Map();
					const storageKey = {
						parents: '1',
						interior: { X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }] },
					} as unknown as StorageKey;
					Object.assign(storageKey, {
						toHuman: (): AnyJson => {
							return [
								{
									parents: '1',
									interior: {
										X2: [{ Parachain: '2125' }, { GeneralIndex: '0' }],
									},
								},
							];
						},
					});
					const codec = mockAssetHubKusamaApi.registry.createType(
						'PalletAssetsAssetDetails',
						{
							owner: '13cKp89Q5jiLjhvTEqAGy2DmEpVf52BvaQePoiN5Eavx7oKB',
							issuer: '13cKp89Q5jiLjhvTEqAGy2DmEpVf52BvaQePoiN5Eavx7oKB',
							admin: '13cKp89Q5jiLjhvTEqAGy2DmEpVf52BvaQePoiN5Eavx7oKB',
							freezer: '13cKp89Q5jiLjhvTEqAGy2DmEpVf52BvaQePoiN5Eavx7oKB',
							supply: 0,
							deposit: 100000000000,
							minBalance: 100000000000,
							isSufficient: false,
							accounts: 0,
							sufficients: 0,
							approvals: 0,
							status: 'Live',
						},
					);
					metadata.set(storageKey, codec);

					const result: [StorageKey<AnyTuple>, PalletAssetsAssetDetails][] = [];
					metadata.forEach((val, key) => {
						result.push([key, val]);
					});

					return result;
				},
			}),
			metadata: foreignAssetsMetadata,
		},
		poolAssets: {
			asset: poolAsset,
		},
		assetConversion: {
			pools: Object.assign(pools, {
				entries: () => {
					const palletAssetConversionNativeOrAssetId = Object.assign(
						[
							{ parents: 0, interior: { Here: '' } },
							{
								parents: 0,
								interior: {
									X2: [{ PalletInstance: 50 }, { GeneralIndex: 100 }],
								},
							},
						],
						{
							toHuman: () => {
								return [
									[
										{ parents: '0', interior: { Here: '' } },
										{
											parents: '0',
											interior: {
												X2: [{ PalletInstance: '50' }, { GeneralIndex: '100' }],
											},
										},
									],
								];
							},
						},
					);

					const poolInfo = Object.assign(
						{
							lpToken: mockAssetHubKusamaApi.registry.createType('u32', 0),
						},
						{
							unwrap: () => {
								return {
									lpToken: mockAssetHubKusamaApi.registry.createType('u32', 0),
								};
							},
							toHuman: () => {
								return { lpToken: 0 };
							},
						},
					);

					return [[palletAssetConversionNativeOrAssetId, poolInfo]];
				},
			}),
		},
	},
	tx: {
		polkadotXcm: {
			limitedReserveTransferAssets:
				mockAssetHubKusamaApi.tx['polkadotXcm'].limitedReserveTransferAssets,
			reserveTransferAssets:
				mockAssetHubKusamaApi.tx['polkadotXcm'].reserveTransferAssets,
			teleportAssets: mockAssetHubKusamaApi.tx['polkadotXcm'].teleportAssets,
			limitedTeleportAssets:
				mockAssetHubKusamaApi.tx['polkadotXcm'].limitedTeleportAssets,
		},
		assets: {
			transfer: mockAssetHubKusamaApi.tx.assets.transfer,
			transferKeepAlive: mockAssetHubKusamaApi.tx.assets.transferKeepAlive,
		},
		foreignAssets: {
			transfer: mockAssetHubKusamaApi.tx.foreignAssets.transfer,
			transferKeepAlive:
				mockAssetHubKusamaApi.tx.foreignAssets.transferKeepAlive,
		},
		balances: {
			transfer: mockAssetHubKusamaApi.tx.balances.transfer,
			transferKeepAlive: mockAssetHubKusamaApi.tx.balances.transferKeepAlive,
		},
		poolAssets: {
			transfer: mockAssetHubKusamaApi.tx.poolAssets.transfer,
			transferKeepAlive: mockAssetHubKusamaApi.tx.poolAssets.transferKeepAlive,
		},
	},
	call: {
		transactionPaymentApi: {
			queryInfo: mockApiAt.call.transactionPaymentApi.queryInfo,
		},
	},
	runtimeVersion: {
		transactionVersion: mockAssetHubKusamaApi.registry.createType('u32', 4),
		specVersion: mockAssetHubKusamaApi.registry.createType('u32', 9420),
	},
	genesisHash: mockAssetHubKusamaApi.registry.createType('BlockHash'),
	disconnect: disconnect,
} as unknown as ApiPromise;
