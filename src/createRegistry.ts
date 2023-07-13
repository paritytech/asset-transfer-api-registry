// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import {
	prodParasKusama,
	prodParasKusamaCommon,
	prodParasPolkadot,
	prodParasPolkadotCommon,
	prodRelayKusama,
	prodRelayPolkadot,
	testParasWestend,
	testParasWestendCommon,
	testRelayWestend,
} from '@polkadot/apps-config';
import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';
import fs from 'fs';

type TokenRegistry = {
	polkadot: {};
	kusama: {};
	westend: {};
};

type ChainName = 'polkadot' | 'kusama' | 'westend';

const unreliableIds = {
	polkadot: [
		2038, // geminis
		2090, // Oak Tech
		2053, // omnibtc
		2018, // subdao
		2093, // hashed network
		3333, // t3rn
	],
	kusama: [
		2257, // aband
		2019, // kpron,
		2080, // loomNetwork
		2016, // sakura
		2018, // subgame
		2236, // zero
		2129, // Ice Network
		2226, // genshiro
		2102, // pichiu
	],
	westend: [],
};

/**
 * Write Json to a file path.
 *
 * @param path Path to write the json file too
 * @param data Data that will be written to file.
 */
const writeJson = (path: string, data: TokenRegistry): void => {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
	fs.appendFileSync(path, '\n', 'utf-8');
};

interface AssetsInfo {
	[key: string]: string;
}

// type ForeignAssetStorageKeyData = MultiLocation[];
type ForeignAssetMetadata = {
	deposit: string;
	name: string;
	symbol: string;
	decimals: string;
	isFrozen: boolean;
};

interface ForeignAssetsInfo {
	[key: string]: {
		symbol: string;
		name: string;
		multiLocation: string;
	};
}

interface PoolInfo {
	lpToken: string;
}
interface PoolNativeAsset {
	parents: number;
	interior: string;
}

interface PoolNonNativeAsset {
	parents: number;
	interior: {
		X2: [{ PalletInstance: string }, { GeneralIndex: string }];
	};
}

type PoolPairInfo = [[PoolNativeAsset, PoolNonNativeAsset]];

type PoolPairsInfo = {
	[key: string]: {
		lpToken: string;
		pairInfo: string;
	};
};

/**
 * Fetch chain token and spec info.
 *
 * @param endpointOpts
 * @param isRelay
 */
const fetchChainInfo = async (
	endpointOpts: EndpointOption,
	isRelay?: boolean
) => {
	const { providers, paraId } = endpointOpts;
	// If no providers are present return an empty object
	if (Object.keys(endpointOpts.providers).length === 0) return null;
	// If a paraId is not present return an empty object;
	if (!paraId && !isRelay) return null;

	const wsUrls = Object.values(providers).filter(
		(url) => !url.startsWith('light')
	);

	const api = await ApiPromise.create({
		provider: new WsProvider(wsUrls),
		noInitWarn: true,
	});

	await api.isReady;

	const assetsPallet = api.registry.metadata.pallets.filter(
		(pallet) => pallet.name.toString().toLowerCase() === 'assets'
	)[0];
	const { tokenSymbol } = await api.rpc.system.properties();
	const { specName } = await api.rpc.state.getRuntimeVersion();
	const tokens = tokenSymbol.isSome
		? tokenSymbol
				.unwrap()
				.toArray()
				.map((token) => token.toString())
		: [];

	const specNameStr = specName.toString();

	let assetsInfo: AssetsInfo = {};
	let foreignAssetsInfo: ForeignAssetsInfo = {};
	let poolPairsInfo: PoolPairsInfo = {};

	if (
		specNameStr === 'westmint' ||
		specNameStr === 'statemine' ||
		specNameStr === 'statemint'
	) {
		assetsInfo = await fetchSystemParachainAssetInfo(api);
		foreignAssetsInfo = await fetchSystemParachainForeignAssetInfo(api);
		poolPairsInfo = await fetchSystemParachainPoolAssetInfo(api);
	}

	await api.disconnect();

	return {
		tokens,
		assetsInfo,
		foreignAssetsInfo,
		poolPairsInfo,
		specName: specNameStr,
		assetsPalletInstance: assetsPallet ? assetsPallet.index.toString() : null,
	};
};

/**
 * This adds to the chain registry for each chain that is passed in.
 *
 * @param chainName Relay chain name
 * @param endpoints Endpoints we are going to iterate through, and query
 * @param registry Registry we want to add the info too
 */
const createChainRegistryFromParas = async (
	chainName: ChainName,
	endpoints: Omit<EndpointOption, 'teleport'>[],
	registry: TokenRegistry
): Promise<void> => {
	for (const endpoint of endpoints) {
		const unreliable: boolean = (unreliableIds[chainName] as number[]).includes(
			endpoint.paraId as number
		);
		if (unreliable) {
			continue;
		}

		const res = await fetchChainInfo(endpoint);
		if (res !== null) {
			registry[chainName][`${endpoint.paraId as number}`] = res;
		}
	}
};

/**
 * Similar to `createChainRegistryFromParas`, this will only add to the registry for a single chain,
 * in this case the relay chain.
 *
 * @param chainName Relay chain name
 * @param endpoint Endpoint we are going to fetch the info from
 * @param registry Registry we want to add the info too
 */
const createChainRegistryFromRelay = async (
	chainName: ChainName,
	endpoint: EndpointOption,
	registry: TokenRegistry
): Promise<void> => {
	const res = await fetchChainInfo(endpoint, true);
	if (res !== null) {
		registry[chainName]['0'] = res;
	}
};

const main = async () => {
	const registry = {
		polkadot: {},
		kusama: {},
		westend: {},
	};
	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];

	// Set the relay chain info to the registry
	await createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry);
	await createChainRegistryFromRelay('kusama', prodRelayKusama, registry);
	await createChainRegistryFromRelay('westend', testRelayWestend, registry);

	// Set the paras info to the registry
	for (const endpoints of polkadotEndpoints) {
		await createChainRegistryFromParas('polkadot', endpoints, registry);
	}

	for (const endpoints of kusamaEndpoints) {
		await createChainRegistryFromParas('kusama', endpoints, registry);
	}

	for (const endpoints of westendEndpoints) {
		await createChainRegistryFromParas('westend', endpoints, registry);
	}

	const path = __dirname + '/../registry.json';
	writeJson(path, registry);
};

const fetchSystemParachainAssetInfo = async (
	api: ApiPromise
): Promise<AssetsInfo> => {
	const assetsInfo: AssetsInfo = {};

	for (const [assetStorageKeyData] of await api.query.assets.asset.entries()) {
		const id = assetStorageKeyData
			.toHuman()
			?.toString()
			.trim()
			.replace(/,/g, '');

		if (id) {
			const assetMetadata = await api.query.assets.metadata(id);
			const assetSymbol = assetMetadata.symbol.toHuman()?.toString();

			if (assetSymbol) {
				assetsInfo[id] = assetSymbol;
			}
		}
	}

	return assetsInfo;
};

const fetchSystemParachainForeignAssetInfo = async (
	api: ApiPromise
): Promise<ForeignAssetsInfo> => {
	const foreignAssetsInfo: ForeignAssetsInfo = {};

	if (api.query.foreignAssets !== undefined) {
		for (const [
			assetStorageKeyData,
		] of await api.query.foreignAssets.asset.entries()) {
			const foreignAssetData = assetStorageKeyData.toHuman();

			if (foreignAssetData) {
				// remove any commas from multilocation key values e.g. Parachain: 2,125 -> Parachain: 2125
				const foreignAssetMultiLocationStr = JSON.stringify(
					foreignAssetData[0]
				).replace(/(\d),/g, '$1');
				const foreignAssetMultiLocation = api.registry.createType(
					'MultiLocation',
					JSON.parse(foreignAssetMultiLocationStr)
				);
				const hexId = foreignAssetMultiLocation.toHex();
				const assetMetadata = (
					await api.query.foreignAssets.metadata(foreignAssetMultiLocation)
				).toHuman();

				if (assetMetadata) {
					const metadata = assetMetadata as ForeignAssetMetadata;
					const assetSymbol = metadata.symbol;
					const assetName = metadata.name;

					// if the symbol exists in metadata use it, otherwise uses the hex of the multilocation as the key
					const foreignAssetInfoKey = assetSymbol ? assetSymbol : hexId;

					foreignAssetsInfo[foreignAssetInfoKey] = {
						symbol: assetSymbol,
						name: assetName,
						multiLocation: JSON.stringify(foreignAssetMultiLocation.toJSON()),
					};
				}
			}
		}
	}

	return foreignAssetsInfo;
};

const fetchSystemParachainPoolAssetInfo = async (
	api: ApiPromise
): Promise<PoolPairsInfo> => {
	const poolPairsInfo: PoolPairsInfo = {};

	if (api.query.assetConversion !== undefined) {
		for (const [
			poolKeyStorageData,
			PoolInfo,
		] of await api.query.assetConversion.pools.entries()) {
			const maybePoolData = poolKeyStorageData.toHuman();
			const maybePoolInfo = PoolInfo.toHuman();

			if (maybePoolData && maybePoolInfo) {
				const poolData = maybePoolData as unknown as PoolPairInfo;

				const pool = maybePoolInfo as unknown as PoolInfo;
				poolPairsInfo[pool.lpToken] = {
					lpToken: pool.lpToken,
					pairInfo: poolData as unknown as string,
				};
			}
		}
	}

	return poolPairsInfo;
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
