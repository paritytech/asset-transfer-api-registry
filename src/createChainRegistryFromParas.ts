// Copyright 2024 Parity Technologies (UK) Ltd.

import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';

/* eslint-disable-next-line */
import FinalRegistry from '../docs/registry.json' with { type: 'json' };
import { fetchChainInfo } from './fetchChainInfo.js';
import type {
	ChainInfoKeys,
	ChainName,
	ParaIds,
	TokenRegistry,
} from './types.js';
import { updateRegistryChainInfo } from './updateRegistryChainInfo.js';
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
): Promise<TokenRegistry> => {
	logWithDate('Creating chain registry from parachains', true);

	twirlTimer();

	const chainInfoPromises: Promise<
		[ChainInfoKeys, number | undefined] | null
	>[] = [];

	for (const endpoint of endpoints) {
		const paraId = endpoint.paraId as number;
		const reliable: boolean = paraIds[chainName].includes(paraId);
		if (!reliable) {
			// Add to registry if it exists
			if (FinalRegistry[chainName] && FinalRegistry[chainName][paraId]) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				registry[chainName][`${paraId}`] = FinalRegistry[chainName][paraId];
			}
			continue;
		}

		appendFetchChainInfoPromise(chainInfoPromises, endpoint, paraId);
	}

	return await updateRegistryChainInfo(chainName, registry, chainInfoPromises);
};

export const appendFetchChainInfoPromise = (
	chainInfoPromises: Promise<[ChainInfoKeys, number | undefined] | null>[],
	endpoint: EndpointOption,
	paraId: number,
) => {
	chainInfoPromises.push(
		fetchChainInfo(endpoint, endpoint.info as unknown as string, false, paraId),
	);
};
