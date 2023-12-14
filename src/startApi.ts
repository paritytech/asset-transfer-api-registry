// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise, WsProvider } from '@polkadot/api';

import { getProvider } from './getProvider';
/**
 * This intakes an array of endpoints and returns a list of viable endpoints
 * ready to be connected to.
 *
 * @param endpoints Endpoint we are going to try to connect to.
 */
export const startApi = async (
	endpoints: string[],
): Promise<ApiPromise | undefined> => {
	const wsProviders = await getProvider(endpoints);

	if (wsProviders === undefined) {
		return;
	}

	console.log('Endpoint providers: ', wsProviders);

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
