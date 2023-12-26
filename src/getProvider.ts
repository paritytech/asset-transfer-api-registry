// Copyright 2023 Parity Technologies (UK) Ltd.

import { WsProvider } from '@polkadot/api';

import { MAX_RETRIES, WS_DISCONNECT_TIMEOUT_SECONDS } from './consts';
import { logWithDate, sleep, twirlTimer } from './util';
import { skipProcessingEndpoint } from './util';

/**
 * This tests the available endpoints to check which are responsive
 * and return an array of providers. It makes a call using WS_DISCONNECT_TIMEOUT_SECONDS
 * to determine the time between attempts. If unsuccessful, it retries MAX_RETRIES
 * amount of times. If successful in that period, the endpoint is included in the
 * return array, otherwise it is discarded and the function moves on to the next candidate.
 *
 * @param wsEndpoints Endpoint we are going to fetch the info from
 */
export const getProvider = async (wsEndpoints: string[], chain: string) => {
	logWithDate(`Getting endpoint providers for ${chain}`, true);

	twirlTimer();

	const enpdointArray: string[] = [];

	let retries = 0;

	for (const [i] of wsEndpoints.entries()) {
		if (skipProcessingEndpoint(wsEndpoints[i])) {
			continue;
		}

		const wsProvider = new WsProvider(wsEndpoints[i]);

		if (!wsProvider.isConnected) {
			while (!wsProvider.isConnected && retries < MAX_RETRIES) {
				await sleep(WS_DISCONNECT_TIMEOUT_SECONDS * 1000);
				retries++;
			}

			await wsProvider.disconnect();

			if (!(retries < MAX_RETRIES)) {
				await wsProvider.disconnect();
				retries = 0;
				continue;
			} else if (wsProvider.isConnected) {
				enpdointArray.push(wsEndpoints[i]);

				await wsProvider.disconnect();
				retries = 0;
			}
		}

		enpdointArray.push(wsEndpoints[i]);
		await wsProvider.disconnect();
	}

	if (enpdointArray.length === 0) {
		return;
	} else {
		return enpdointArray;
	}
};
