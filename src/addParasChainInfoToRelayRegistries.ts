import { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { createChainRegistryFromParas } from './createChainRegistryFromParas.js';
import { ParaIds, TokenRegistry } from './types.js';

export const addParasChainInfoToRelayRegistries = async (
	registry: TokenRegistry,
	paraIds: ParaIds,
	polkadotEndpoints: Omit<EndpointOption, 'teleport'>[][],
	kusamaEndpoints: Omit<EndpointOption, 'teleport'>[][],
	westendEndpoints: Omit<EndpointOption, 'teleport'>[][],
	paseoEndpoints: Omit<EndpointOption, 'teleport'>[][],
): Promise<TokenRegistry> => {
	// store all create chain registry para promises
	const chainRegistryFromParasPromises: Promise<TokenRegistry>[] = [];

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
	for (const endpoints of paseoEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas('paseo', endpoints, registry, paraIds),
		);
	}

	// set the paras info to the registry
	await Promise.all(chainRegistryFromParasPromises);

	return registry;
};
