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
	testParasRococo,
	testParasRococoCommon,
	testParasWestend,
	testParasWestendCommon,
	testRelayRococo,
	testRelayWestend,
} from '@polkadot/apps-config';
import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';
import { stringToHex } from '@polkadot/util';
import fetch from 'node-fetch';
import path from 'path';

import FinalRegistry from '../registry.json';
import type {
	AssetsInfo,
	ChainInfoKeys,
	ChainName,
	ForeignAssetMetadata,
	ForeignAssetsInfo,
	ParaIds,
	PoolInfo,
	PoolPairsInfo,
	SanitizedXcAssetsData,
	TokenRegistry,
	UnionXcmMultiLocation,
	XcAssets,
	XcAssetsData,
} from './types';
import { sleep, twirlTimer, writeJson } from './util';

/**
 * @const MAX_RETRIES Maximum amount of connection attempts
 * @const WS_DISCONNECT_TIMEOUT_SECONDS time to wait between attempts, in seconds
 */
const MAX_RETRIES = 5;
const WS_DISCONNECT_TIMEOUT_SECONDS = 3;
const XC_ASSET_CDN_URL =
	'https://cdn.jsdelivr.net/gh/colorfulnotion/xcm-global-registry/metadata/xcmgar.json';

/**
 * Determines when endpoint processing should be skipped.
 *
 * @param endpoint
 */
const skipProcessingEndpoint = (endpoint: string): boolean => {
	if (
		endpoint.includes('onfinality') ||
		endpoint === 'wss://polkadot-public-rpc.blockops.network/ws' ||
		endpoint === 'wss://kusama-public-rpc.blockops.network/ws' ||
		endpoint === 'wss://westend-rpc.blockops.network/ws'
	) {
		return true;
	}

	return false;
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
	const api = await getApi(endpointOpts, isRelay);
	console.log('Api connected: ', api?.isConnected);

	if (api !== null && api !== undefined) {
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
	paraIds: ParaIds
): Promise<void> => {
	console.log('Creating chain registry from parachains');

	twirlTimer();

	const fetchChainInfoPromises: Promise<void>[] = [];

	for (const endpoint of endpoints) {
		const reliable: boolean = paraIds[chainName].includes(
			endpoint.paraId as number
		);
		if (!reliable) {
			// Add to registry if it exists
			if (
				FinalRegistry[chainName] &&
				FinalRegistry[chainName][endpoint.paraId as number]
			) {
				registry[chainName][`${endpoint.paraId as number}`] = FinalRegistry[
					chainName
				][endpoint.paraId as number] as ChainInfoKeys;
			}
			continue;
		}
		fetchChainInfoPromises.push(
			fetchChainInfo(endpoint).then((res) => {
				if (res !== null) {
					registry[chainName][`${endpoint.paraId as number}`] = res;
				}
			})
		);
	}

	await Promise.all(fetchChainInfoPromises);
};

/**
 * Similar to `createChainRegistryFromParas`, this will only add to the registry for a single chain,
 * in this case the relay chain.
 *
 * @param chainName Relay chain name
 * @param endpoint Endpoint we are going to fetch the info from
 * @param registry Registry we want to add the info to
 */
const createChainRegistryFromRelay = async (
	chainName: ChainName,
	endpoint: EndpointOption,
	registry: TokenRegistry
): Promise<void> => {
	console.log(`Creating chain registry from ${chainName} relay`);
	twirlTimer();
	const res = await fetchChainInfo(endpoint, true);
	if (res !== null) {
		registry[chainName]['0'] = res;
	}
};

/**
 * Fetch Asset info for system parachains.
 *
 * @param api
//  */
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

/**
 * This will fetch all the foreign asset entries in storage and return an object
 * with each key as the id, and then the info as the nested keys.
 *
 * @param api ApiPromise
 */
const fetchSystemParachainForeignAssetInfo = async (
	api: ApiPromise
): Promise<ForeignAssetsInfo> => {
	const foreignAssetsInfo: ForeignAssetsInfo = {};

	if (api.query.foreignAssets !== undefined) {
		const assetEntries = await api.query.foreignAssets.asset.entries();

		for (const [assetStorageKeyData] of assetEntries) {
			const foreignAssetData = assetStorageKeyData.toHuman();

			if (foreignAssetData) {
				// remove any commas from multilocation key values e.g. Parachain: 2,125 -> Parachain: 2125
				const foreignAssetMultiLocationStr = JSON.stringify(
					foreignAssetData[0]
				).replace(/(\d),/g, '$1');

				const foreignAssetMultiLocation = JSON.parse(
					foreignAssetMultiLocationStr
				) as UnionXcmMultiLocation;

				const hexId = stringToHex(JSON.stringify(foreignAssetMultiLocation));

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
						multiLocation: JSON.stringify(foreignAssetMultiLocation),
					};
				}
			}
		}
	}

	return foreignAssetsInfo;
};

/**
 * Fetch asset conversion pool info from storage. This will return an object where
 * the keys are the token, and the objects within contain info about the token.
 *
 * @param api ApiPromise
 */
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

				const palletAssetConversionNativeOrAssetIdData = JSON.parse(
					poolAssetDataStr
				) as UnionXcmMultiLocation[][];

				const pool = maybePoolInfo as unknown as PoolInfo;

				poolPairsInfo[pool.lpToken] = {
					lpToken: pool.lpToken,
					pairInfo: JSON.stringify(palletAssetConversionNativeOrAssetIdData),
				};
			}
		}
	}

	return poolPairsInfo;
};

/**
 * This will create a registry of Parachain Ids.
 *
 * @param chain Relay chain name
 * @param endpointOpts Endpoint we are going to fetch the info from
 * @param paraIds Registry we want to add the info to
 */
const fetchParaIds = async (
	chain: string,
	endpointOpts: EndpointOption,
	paraIds: ParaIds
): Promise<ParaIds> => {
	const api = await getApi(endpointOpts, true);

	if (api !== null && api !== undefined) {
		const paras = await api.query.paras.parachains();
		const paraIdsJson = paras.toJSON();
		paraIds[chain] = paraIdsJson as number[];
		await api.disconnect();
	}

	return paraIds;
};

/**
 * This will attempt to retrieve an active api that has succesfully connected to a node.
 * It will return null if no connection is made.
 *
 * @param endpointOpts
 * @param isRelay
 */
const getApi = async (endpointOpts: EndpointOption, isRelay?: boolean) => {
	const { providers, paraId } = endpointOpts;

	// If no providers are present return null.
	if (Object.keys(endpointOpts.providers).length === 0) return null;
	// If a paraId is not present return null.
	if (!paraId && !isRelay) return null;

	const endpoints = Object.values(providers).filter(
		(url) => !url.startsWith('light')
	);

	const api = await startApi(endpoints);

	return api;
};

/**
 * This intakes an array of endpoints and returns a list of viable endpoints
 * ready to be connected to.
 *
 * @param endpoints Endpoint we are going to try to connect to.
 */
const startApi = async (
	endpoints: string[]
): Promise<ApiPromise | undefined> => {
	const wsProviders = await getProvider(endpoints);

	if (wsProviders === undefined) {
		return;
	}

	console.log('Endpoint providers: ', wsProviders);

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

/**
 * This tests the available endpoints to check which are responsive
 * and return an array of providers. It makes a call using WS_DISCONNECT_TIMEOUT_SECONDS
 * to determine the time between attempts. If unsuccessful, it retries MAX_RETRIES
 * amount of times. If successful in that period, the endpoint is included in the
 * return array, otherwise it is discarded and the function moves on to the next candidate.
 *
 * @param wsEndpoints Endpoint we are going to fetch the info from
 */
const getProvider = async (wsEndpoints: string[]) => {
	console.log('Getting endpoint providers');

	twirlTimer();

	const enpdointArray: string[] = [];

	let retries = 0;

	for (const [i] of wsEndpoints.entries()) {
		if (skipProcessingEndpoint(wsEndpoints[i])) {
			continue;
		}

		const wsProvider = new WsProvider(wsEndpoints[i]);

		if (!wsProvider.isConnected) {
			while (!wsProvider.isConnected && retries < MAX_RETRIES) {
				await sleep(WS_DISCONNECT_TIMEOUT_SECONDS * 1000);
				retries++;
			}

			await wsProvider.disconnect();

			if (!(retries < MAX_RETRIES)) {
				await wsProvider.disconnect();
				retries = 0;
				continue;
			} else if (wsProvider.isConnected) {
				enpdointArray.push(wsEndpoints[i]);

				await wsProvider.disconnect();
				retries = 0;
			}
		}

		enpdointArray.push(wsEndpoints[i]);
		await wsProvider.disconnect();
	}

	if (enpdointArray.length === 0) {
		return;
	} else {
		return enpdointArray;
	}
};

const fetchXcAssetsRegistryInfo = async (
	registry: TokenRegistry
): Promise<void> => {
	const xcAssetsRegistry = (await (await fetch(XC_ASSET_CDN_URL)).json()) as {
		xcAssets: XcAssets;
	};
	const { xcAssets } = xcAssetsRegistry;

	assignXcAssetsToRelay(registry, xcAssets, 'polkadot');
	assignXcAssetsToRelay(registry, xcAssets, 'kusama');
};

const assignXcAssetsToRelay = (
	registry: TokenRegistry,
	xcAssets: XcAssets,
	chain: 'polkadot' | 'kusama'
): void => {
	const chainAssetInfo = xcAssets[chain];
	for (const paraInfo of chainAssetInfo) {
		const { paraID } = paraInfo;
		const para = registry[chain][paraID];

		if (para) {
			const sanitizedData = sanitizeXcAssetData(paraInfo.data);
			para['xcAssetsData'] = sanitizedData;
		}
	}
};

const sanitizeXcAssetData = (data: XcAssetsData[]): SanitizedXcAssetsData[] => {
	const mappedData = data.map((info) => {
		return {
			paraID: info.paraID,
			nativeChainId: info.nativeChainId,
			symbol: info.symbol,
			decimals: info.decimals,
			xcmV1MultiLocation: JSON.stringify(info.xcmV1MultiLocation),
			asset: info.asset,
		};
	});

	return mappedData;
};

const main = async () => {
	const registry = {
		polkadot: {},
		kusama: {},
		westend: {},
		rococo: {},
	};

	const paraIds: ParaIds = {};

	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];
	const rococoEndpoints = [testParasRococo, testParasRococoCommon];

	const fetchParaIdsPromises: Promise<ParaIds>[] = [];

	fetchParaIdsPromises.push(
		fetchParaIds('polkadot', prodRelayPolkadot, paraIds)
	);
	fetchParaIdsPromises.push(fetchParaIds('kusama', prodRelayKusama, paraIds));
	fetchParaIdsPromises.push(fetchParaIds('westend', testRelayWestend, paraIds));
	fetchParaIdsPromises.push(fetchParaIds('rococo', testRelayRococo, paraIds));

	// Set the Parachains Ids to the corresponding registry
	await Promise.all(fetchParaIdsPromises);

	// store all create chain registry relay promises
	const createChainRegistryFromRelayPromises: Promise<void>[] = [];

	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry)
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('kusama', prodRelayKusama, registry)
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('westend', testRelayWestend, registry)
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('rococo', testRelayRococo, registry)
	);

	// Set the relay chain info to the registry
	await Promise.all(createChainRegistryFromRelayPromises);

	// store all create chain registry para promises
	const chainRegistryFromParasPromises: Promise<void>[] = [];

	for (const endpoints of polkadotEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('polkadot', endpoints, registry, paraIds)
		);
	}

	for (const endpoints of kusamaEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('kusama', endpoints, registry, paraIds)
		);
	}

	for (const endpoints of westendEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('westend', endpoints, registry, paraIds)
		);
	}

	for (const endpoints of rococoEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('rococo', endpoints, registry, paraIds)
		);
	}

	// set the paras info to the registry
	await Promise.all(chainRegistryFromParasPromises);

	// fetch xcAssets and add them to the registry
	await fetchXcAssetsRegistryInfo(registry);

	const filePath = path.join(__dirname, '..', '..', 'registry.json');
	writeJson(filePath, registry);
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
