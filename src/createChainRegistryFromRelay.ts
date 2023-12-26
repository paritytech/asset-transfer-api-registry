// Copyright 2023 Parity Technologies (UK) Ltd.

import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { fetchChainInfo } from './fetchChainInfo';
import type { ChainName, TokenRegistry } from './types';
import { logWithDate, twirlTimer } from './util';

/**
 * Similar to `createChainRegistryFromParas`, this will only add to the registry for a single chain,
 * in this case the relay chain.
 *
 * @param chainName Relay chain name
 * @param endpoint Endpoint we are going to fetch the info from
 * @param registry Registry we want to add the info to
 */
export const createChainRegistryFromRelay = async (
	chainName: ChainName,
	endpoint: EndpointOption,
	registry: TokenRegistry,
) => {
	logWithDate(`Creating chain registry for ${chainName} relay`, true);
	twirlTimer();
	const res = await fetchChainInfo(
		endpoint,
		endpoint.info as unknown as string,
		true,
	);
	if (res !== null) {
		registry[chainName]['0'] = res;
	}
};
