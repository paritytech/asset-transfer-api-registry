import { ApiPromise } from '@polkadot/api';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { createChainRegistryFromParas } from './createChainRegistryFromParas';
import { ParaIds, TokenRegistry } from './types';

export const addParasChainInfoToRelayRegistries = async (
	registry: TokenRegistry,
	paraIds: ParaIds,
	relayApis: { [x: string]: ApiPromise | undefined | null },
	_polkadotEndpoints: Omit<EndpointOption, 'teleport'>[][],
	kusamaEndpoints: Omit<EndpointOption, 'teleport'>[][],
	_westendEndpoints: Omit<EndpointOption, 'teleport'>[][],
	_rococoEndpoints: Omit<EndpointOption, 'teleport'>[][],
): Promise<TokenRegistry> => {
	// store all create chain registry para promises
	const chainRegistryFromParasPromises: Promise<TokenRegistry>[] = [];

	// for (const endpoints of polkadotEndpoints) {
	// 	chainRegistryFromParasPromises.push(
	// 		createChainRegistryFromParas(
	// 			relayApis['polkadot'],
	// 			'polkadot',
	// 			endpoints,
	// 			registry,
	// 			paraIds,
	// 		),
	// 	);
	// }

	for (const endpoints of kusamaEndpoints) {
		chainRegistryFromParasPromises.push(
			createChainRegistryFromParas(
				relayApis['kusama'],
				'kusama',
				endpoints,
				registry,
				paraIds,
			),
		);
	}

	// for (const endpoints of westendEndpoints) {
	// 	chainRegistryFromParasPromises.push(
	// 		createChainRegistryFromParas(
	// 			relayApis['westend'],
	// 			'westend',
	// 			endpoints,
	// 			registry,
	// 			paraIds,
	// 		),
	// 	);
	// }
	// for (const endpoints of rococoEndpoints) {
	// 	chainRegistryFromParasPromises.push(
	// 		createChainRegistryFromParas(
	// 			relayApis['rococo'],
	// 			'rococo',
	// 			endpoints,
	// 			registry,
	// 			paraIds,
	// 		),
	// 	);
	// }

	// set the paras info to the registry
	await Promise.all(chainRegistryFromParasPromises);

	return registry;
};
