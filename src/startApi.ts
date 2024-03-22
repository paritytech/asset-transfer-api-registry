// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';

import { getProvider } from './getProvider.js';

const blackListedApis = ['wss://rpc.parallel.fi'];

/**
 * This intakes an array of endpoints and returns a list of viable endpoints
 * ready to be connected to.
 *
 * @param endpoints Endpoint we are going to try to connect to.
 */
export const startApi = async (
	endpoints: string[],
	chain: string,
): Promise<ApiPromise | undefined> => {
	const wsProviders = await getProvider(endpoints, chain);

	if (wsProviders === undefined) {
		return;
	} else {
		for (let i = 0; i < blackListedApis.length; i++) {
			if (wsProviders.includes(blackListedApis[i])) {
				return;
			}
		}
	}

	const providers = new WsProvider(wsProviders);
	const api = await ApiPromise.create({
		provider: providers,
		noInitWarn: true,
	});

	await api.isReady;

	api.on('error', async () => {
		await api.disconnect();
	});

	return api;
};
