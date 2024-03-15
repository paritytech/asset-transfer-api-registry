// Copyright 2023 Parity Technologies (UK) Ltd.

import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import FinalRegistry from '../docs/registry.json' assert { type: 'json' };
import { fetchChainInfo } from './fetchChainInfo.js';
import type { ChainName, ParaIds, TokenRegistry } from './types.js';
import { logWithDate, twirlTimer } from './util.js';

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
	paraIds: ParaIds,
) => {
	logWithDate('Creating chain registry from parachains', true);

	twirlTimer();

	const fetchChainInfoPromises: Promise<void>[] = [];

	for (const endpoint of endpoints) {
		const reliable: boolean = paraIds[chainName].includes(
			endpoint.paraId as number,
		);
		if (!reliable) {
			// Add to registry if it exists
			if (
				FinalRegistry[chainName] &&
				FinalRegistry[chainName][endpoint.paraId as number]
			) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				registry[chainName][`${endpoint.paraId as number}`] =
					FinalRegistry[chainName][endpoint.paraId as number];
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
		fetchChainInfo(endpoint, endpoint.info as unknown as string).then((res) => {
			if (res !== null) {
				registry[chainName][`${endpoint.paraId as number}`] = res;
			}
		}),
	);
};
