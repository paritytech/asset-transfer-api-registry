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

type PoolPairsInfo = {
	[key: string]: {
		lpToken: string;
		pairInfo: string;
	};
};

interface ParaIds {
	[key: string]: number[];
}

const MAX_RETRIES = 5;
const WS_DISCONNECT_TIMEOUT_SECONDS = 3;

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
	console.log('fetching info');
	const api = await getApi(endpointOpts, isRelay);
	console.log('is api connected?', api?.isConnected);

	console.log('info', endpointOpts.info);
	console.log('providers', endpointOpts.providers);

	if (api !== null && api !== undefined) {
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
			poolPairsInfo = await fetchSystemParachainAssetConversionPoolInfo(api);
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
	} else {
		return null;
	}
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
	registry: TokenRegistry,
	reliable: ParaIds
): Promise<void> => {
	console.log('creating chain registry from paras');
	for (const endpoint of endpoints) {
		console.log('paraid', endpoint.paraId);
		const unreliable: boolean = reliable[chainName].includes(
			endpoint.paraId as number
		);
		// console.log("unreliable is", unreliable);
		if (!unreliable) {
			continue;
		}
		// console.log("starting fetching info")
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
	console.log('creating chain registry from relay');
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

	const reliable: ParaIds = {};

	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];

	await getParaIds('polkadot', prodRelayPolkadot, reliable);
	await getParaIds('kusama', prodRelayKusama, reliable);
	await getParaIds('westend', testRelayWestend, reliable);

	// Set the relay chain info to the registry
	await createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry);
	await createChainRegistryFromRelay('kusama', prodRelayKusama, registry);
	await createChainRegistryFromRelay('westend', testRelayWestend, registry);

	// Set the paras info to the registry
	for (const endpoints of polkadotEndpoints) {
		await createChainRegistryFromParas(
			'polkadot',
			endpoints,
			registry,
			reliable
		);
	}

	for (const endpoints of kusamaEndpoints) {
		await createChainRegistryFromParas('kusama', endpoints, registry, reliable);
	}

	for (const endpoints of westendEndpoints) {
		await createChainRegistryFromParas(
			'westend',
			endpoints,
			registry,
			reliable
		);
	}

	const path = __dirname + '/../registry.json';
	writeJson(path, registry);
};

const fetchSystemParachainAssetInfo = async (
	api: ApiPromise
): Promise<AssetsInfo> => {
	const assetsInfo: AssetsInfo = {};
	console.log('fetchSystemParasInfo');

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
	// console.log("fetchSystemParasInfo foreign assets");
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

				// const id = parseInt(foreignAssetData[0].interior.X2[1].GeneralIndex);
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

const fetchSystemParachainAssetConversionPoolInfo = async (
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
				// remove any commas from multilocation key values e.g. Parachain: 2,125 -> Parachain: 2125
				const poolAssetDataStr = JSON.stringify(maybePoolData).replace(
					/(\d),/g,
					'$1'
				);

				const palletAssetConversionNativeOrAssetIdData =
					api.registry.createType(
						'Vec<Vec<MultiLocation>>',
						JSON.parse(poolAssetDataStr)
					);
				const pool = maybePoolInfo as unknown as PoolInfo;

				poolPairsInfo[pool.lpToken] = {
					lpToken: pool.lpToken,
					pairInfo: JSON.stringify(
						palletAssetConversionNativeOrAssetIdData.toJSON()
					),
				};
			}
		}
	}

	return poolPairsInfo;
};

const getParaIds = async (
	chain: string,
	endpointOpts: EndpointOption,
	reliable: ParaIds
): Promise<ParaIds> => {
	const api = await getApi(endpointOpts, true);
	if (api !== null && api !== undefined) {
		const paras = await api.query.paras.parachains();
		const paraIdsJson = paras.toJSON();
		reliable[chain] = paraIdsJson as number[];
		await api.disconnect();
	}
	console.log('got paraId', chain);
	console.log(reliable);

	return reliable;
};

export const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	});
};

const getApi = async (endpointOpts: EndpointOption, isRelay?: boolean) => {
	const { providers, paraId } = endpointOpts;

	// If no providers are present return an empty object
	if (Object.keys(endpointOpts.providers).length === 0) return null;
	// If a paraId is not present return an empty object;
	if (!paraId && !isRelay) return null;

	const endpoints = Object.values(providers).filter(
		(url) => !url.startsWith('light')
	);
	console.log('ENDPOINTS', endpoints);

	const api = await startApi(endpoints);
	return api;
};

const startApi = async (
	endpoints: string[]
): Promise<ApiPromise | undefined> => {
	const wsProviders = await getProvider(endpoints);
	if (wsProviders === undefined) {
		return;
	}
	console.log('PROVIDERS', wsProviders);

	const providers = new WsProvider(wsProviders);

	const api = await ApiPromise.create({
		provider: providers,
		noInitWarn: true,
	});
	await api.isReady;

	api.on('error', async () => {
		await api.disconnect();
	});

	return api;
};

const getProvider = async (wsEndpoints: string[]) => {
	const enpdointArray: string[] = [];
	let retry = 0;
	for (const [i, wsEndpoint] of wsEndpoints.entries()) {
		console.log('FOR LOOP', wsEndpoint);
		const wsProvider = new WsProvider(wsEndpoints[i]);
		// healthCheckInProgress = true;
		if (wsProvider.isConnected) {
			enpdointArray.push(wsEndpoints[i]);
			// healthCheckInProgress = false;
			await wsProvider.disconnect();
			console.log(enpdointArray);
		} else {
			// if (retry < MAX_RETRIES)
			//  {
			console.log('connected?', wsProvider.isConnected);
			while (!wsProvider.isConnected && retry < MAX_RETRIES) {
				await sleep(WS_DISCONNECT_TIMEOUT_SECONDS * 1000);
				retry++;
				// console.log("retries: ", retry);
			}
			await wsProvider.disconnect();
			console.log('ws disconnected');
			// };
			if (!(retry < MAX_RETRIES)) {
				// healthCheckInProgress = false;
				await wsProvider.disconnect();
				retry = 0;
				continue;
			} else if (wsProvider.isConnected) {
				enpdointArray.push(wsEndpoints[i]);
				// healthCheckInProgress = false;
				console.log('array', enpdointArray);

				await wsProvider.disconnect();
				retry = 0;
			}
		}
	}
	if (enpdointArray.length === 0) {
		return;
	} else {
		return enpdointArray;
	}
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
