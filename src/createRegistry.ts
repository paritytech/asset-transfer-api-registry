// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

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
import {
	testParasPaseo,
	testParasPaseoCommon,
	testRelayPaseo,
} from '@polkadot/apps-config/endpoints/testingRelayPaseo';

import { addParasChainInfoToRelayRegistries } from './addParasChainInfoToRelayRegistries.js';
import { createChainRegistryFromRelay } from './createChainRegistryFromRelay.js';
import { fetchParaIds } from './fetchParaIds.js';
import { fetchParaspellRegistryInfo } from './fetchParaspellRegistry.js';
import type { ParaIds, TokenRegistry } from './types.js';
import { writeJson } from './util.js';

export const main = async (filePath: string, registry: TokenRegistry) => {
	const paraIds: ParaIds = {};

	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];
	const paseoEndpoints = [testParasPaseo, testParasPaseoCommon];

	const fetchParaIdsPromises: Promise<ParaIds>[] = [];
	fetchParaIdsPromises.push(
		fetchParaIds('polkadot', prodRelayPolkadot, paraIds),
	);
	fetchParaIdsPromises.push(fetchParaIds('kusama', prodRelayKusama, paraIds));
	fetchParaIdsPromises.push(fetchParaIds('westend', testRelayWestend, paraIds));
	fetchParaIdsPromises.push(fetchParaIds('paseo', testRelayPaseo, paraIds));

	// Set the Parachains Ids to the corresponding registry
	await Promise.all(fetchParaIdsPromises);

	// store all create chain registry relay promises
	const createChainRegistryFromRelayPromises: Promise<TokenRegistry>[] = [];

	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('polkadot', prodRelayPolkadot, registry),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('kusama', prodRelayKusama, registry),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('westend', testRelayWestend, registry),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('paseo', testRelayPaseo, registry),
	);

	// Set the relay chain info to the registry
	await Promise.all(createChainRegistryFromRelayPromises);

	registry = await addParasChainInfoToRelayRegistries(
		registry,
		paraIds,
		polkadotEndpoints,
		kusamaEndpoints,
		westendEndpoints,
		paseoEndpoints,
	);

	// Integrate Paraspell registry data
	registry = await fetchParaspellRegistryInfo(registry);

	writeJson(filePath, registry);
};
