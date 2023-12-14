// Copyright 2023 Parity Technologies (UK) Ltd.

import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { fetchChainInfo } from './fetchChainInfo';
import type { ChainInfoKeys, ChainName, ParaIds, TokenRegistry } from './types';
import { twirlTimer } from './util';

/**
 * This adds to the chain registry for each chain that is passed in.
 *
 * @param chainName Relay chain name
 * @param endpoints Endpoints we are going to iterate through, and query
 * @param registry Registry we want to add the info too
 */
export const createChainRegistryFromParas = async (
	chainName: ChainName,
	endpoints: Omit<EndpointOption, 'teleport'>[],
	registry: TokenRegistry,
	currentRegistry: TokenRegistry,
	paraIds: ParaIds,
) => {
	console.log('Creating chain registry from parachains');

	twirlTimer();

	const fetchChainInfoPromises: Promise<void>[] = [];

	for (const endpoint of endpoints) {
		const reliable: boolean = paraIds[chainName].includes(
			endpoint.paraId as number,
		);
		if (!reliable) {
			// Add to registry if it exists
			if (
				currentRegistry[chainName] &&
				currentRegistry[chainName][endpoint.paraId as number]
			) {
				registry[chainName][`${endpoint.paraId as number}`] =
					currentRegistry[chainName][endpoint.paraId as number];
			}
			continue;
		}

		appendFetchChainInfoPromise(
			fetchChainInfoPromises,
			endpoint,
			registry,
			chainName,
		);
	}

	await Promise.all(fetchChainInfoPromises);
};

export const appendFetchChainInfoPromise = (
	fetchChainInfoPromises: Promise<void>[],
	endpoint: EndpointOption,
	registry: TokenRegistry,
	chainName: ChainName,
) => {
	fetchChainInfoPromises.push(
		fetchChainInfo(endpoint).then((res) => {
			if (res !== null) {
				registry[chainName][`${endpoint.paraId as number}`] = res;
			}
		}),
	);
};
