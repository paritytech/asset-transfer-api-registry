// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import { ApiPromise } from '@polkadot/api';
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

import { addParasChainInfoToRelayRegistries } from './addParasChainInfoToRelayRegistries.js';
import { createChainRegistryFromRelay } from './createChainRegistryFromRelay.js';
import { fetchParaIds } from './fetchParaIds.js';
import { fetchXcAssetsRegistryInfo } from './fetchXcAssetsRegistryInfo.js';
import { getApi } from './getApi.js';
import type { ParaIds, TokenRegistry } from './types.js';
import { writeJson } from './util.js';

export const main = async (filePath: string, registry: TokenRegistry) => {
	const paraIds: ParaIds = {};

	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];
	const rococoEndpoints = [testParasRococo, testParasRococoCommon];

	const relayApis: { [x: string]: ApiPromise | undefined | null } = {};
	const fetchRelayApis: Promise<ApiPromise | null | undefined>[] = [];
	fetchRelayApis.push(getApi(prodRelayPolkadot, 'polkadot', true));
	fetchRelayApis.push(getApi(prodRelayKusama, 'kusama', true));
	fetchRelayApis.push(getApi(testRelayWestend, 'westend', true));
	fetchRelayApis.push(getApi(testRelayRococo, 'rococo', true));
	await Promise.all(fetchRelayApis).then(async (apis) => {
		for (const api of apis) {
			if (api) {
				const { specName } = await api.rpc.state.getRuntimeVersion();
				relayApis[specName.toString()] = api;
			}
		}
	});

	const fetchParaIdsPromises: Promise<ParaIds>[] = [];
	fetchParaIdsPromises.push(
		fetchParaIds(relayApis['polkadot'], 'polkadot', paraIds),
	);
	fetchParaIdsPromises.push(
		fetchParaIds(relayApis['kusama'], 'kusama', paraIds),
	);
	fetchParaIdsPromises.push(
		fetchParaIds(relayApis['westend'], 'westend', paraIds),
	);
	fetchParaIdsPromises.push(
		fetchParaIds(relayApis['rococo'], 'rococo', paraIds),
	);

	// Set the Parachains Ids to the corresponding registry
	await Promise.all(fetchParaIdsPromises);

	// store all create chain registry relay promises
	const createChainRegistryFromRelayPromises: Promise<TokenRegistry>[] = [];

	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay(
			relayApis['polkadot'],
			'polkadot',
			prodRelayPolkadot,
			registry,
		),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay(
			relayApis['kusama'],
			'kusama',
			prodRelayKusama,
			registry,
		),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay(
			relayApis['westend'],
			'westend',
			testRelayWestend,
			registry,
		),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay(
			relayApis['rococo'],
			'rococo',
			testRelayRococo,
			registry,
		),
	);

	// Set the relay chain info to the registry
	await Promise.all(createChainRegistryFromRelayPromises);

	registry = await addParasChainInfoToRelayRegistries(
		registry,
		paraIds,
		relayApis,
		polkadotEndpoints,
		kusamaEndpoints,
		westendEndpoints,
		rococoEndpoints,
	);

	// fetch xcAssets and add them to the registry
	registry = await fetchXcAssetsRegistryInfo(registry);

	writeJson(filePath, registry);
};
