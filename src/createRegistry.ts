// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

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

import { createChainRegistryFromParas } from './createChainRegistryFromParas';
import { createChainRegistryFromRelay } from './createChainRegistryFromRelay';
import { fetchParaIds } from './fetchParaIds';
import { fetchXcAssetsRegistryInfo } from './fetchXcAssetRegistryInfo';
import type { ParaIds, TokenRegistry } from './types';
import { writeJson } from './util';

export const main = async (filePath: string, registry: TokenRegistry) => {
	const paraIds: ParaIds = {};

	const polkadotEndpoints = [prodParasPolkadot, prodParasPolkadotCommon];
	const kusamaEndpoints = [prodParasKusama, prodParasKusamaCommon];
	const westendEndpoints = [testParasWestend, testParasWestendCommon];
	const rococoEndpoints = [testParasRococo, testParasRococoCommon];

	const fetchParaIdsPromises: Promise<ParaIds>[] = [];

	fetchParaIdsPromises.push(
		fetchParaIds('polkadot', prodRelayPolkadot, paraIds),
	);
	fetchParaIdsPromises.push(fetchParaIds('kusama', prodRelayKusama, paraIds));
	fetchParaIdsPromises.push(fetchParaIds('westend', testRelayWestend, paraIds));
	fetchParaIdsPromises.push(fetchParaIds('rococo', testRelayRococo, paraIds));

	// Set the Parachains Ids to the corresponding registry
	await Promise.all(fetchParaIdsPromises);

	// store all create chain registry relay promises
	const createChainRegistryFromRelayPromises: Promise<void>[] = [];

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
		createChainRegistryFromRelay('rococo', testRelayRococo, registry),
	);

	// Set the relay chain info to the registry
	await Promise.all(createChainRegistryFromRelayPromises);

	// store all create chain registry para promises
	const chainRegistryFromParasPromises: Promise<void>[] = [];

	for (const endpoints of polkadotEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('polkadot', endpoints, registry, paraIds),
		);
	}

	for (const endpoints of kusamaEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('kusama', endpoints, registry, paraIds),
		);
	}

	for (const endpoints of westendEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('westend', endpoints, registry, paraIds),
		);
	}
	for (const endpoints of rococoEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('rococo', endpoints, registry, paraIds),
		);
	}

	// set the paras info to the registry
	await Promise.all(chainRegistryFromParasPromises);

	// fetch xcAssets and add them to the registry
	await fetchXcAssetsRegistryInfo(registry);

	writeJson(filePath, registry);
};
