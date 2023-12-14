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

export const main = async (
	filePath: string,
	newRegistry: TokenRegistry,
	currentRegistry: TokenRegistry,
) => {
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

	// Set the Parachains Ids to the corresponding newRegistry
	await Promise.all(fetchParaIdsPromises);

	// store all create chain newRegistry relay promises
	const createChainRegistryFromRelayPromises: Promise<void>[] = [];

	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('polkadot', prodRelayPolkadot, newRegistry),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('kusama', prodRelayKusama, newRegistry),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('westend', testRelayWestend, newRegistry),
	);
	createChainRegistryFromRelayPromises.push(
		createChainRegistryFromRelay('rococo', testRelayRococo, newRegistry),
	);

	// Set the relay chain info to the newRegistry
	await Promise.all(createChainRegistryFromRelayPromises);

	// store all create chain newRegistry para promises
	const chainRegistryFromParasPromises: Promise<void>[] = [];

	for (const endpoints of polkadotEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas(
				'polkadot',
				endpoints,
				newRegistry,
				currentRegistry,
				paraIds,
			),
		);
	}

	for (const endpoints of kusamaEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas(
				'kusama',
				endpoints,
				newRegistry,
				currentRegistry,
				paraIds,
			),
		);
	}

	for (const endpoints of westendEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas(
				'westend',
				endpoints,
				newRegistry,
				currentRegistry,
				paraIds,
			),
		);
	}
	for (const endpoints of rococoEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas(
				'rococo',
				endpoints,
				newRegistry,
				currentRegistry,
				paraIds,
			),
		);
	}

	// set the paras info to the newRegistry
	await Promise.all(chainRegistryFromParasPromises);

	// fetch xcAssets and add them to the newRegistry
	await fetchXcAssetsRegistryInfo(newRegistry);

	writeJson(filePath, newRegistry);
};
