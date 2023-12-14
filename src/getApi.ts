// Copyright 2023 Parity Technologies (UK) Ltd.

import type { EndpointOption } from '@polkadot/apps-config/endpoints/types';

import { startApi } from './startApi';
/**
 * This will attempt to retrieve an active api that has succesfully connected to a node.
 * It will return null if no connection is made.
 *
 * @param endpointOpts
 * @param isRelay
 */
export const getApi = async (
	endpointOpts: EndpointOption,
	isRelay?: boolean,
) => {
	const { providers, paraId } = endpointOpts;

	// If no providers are present return null.
	if (Object.keys(endpointOpts.providers).length === 0) return null;
	// If a paraId is not present return null.
	if (!paraId && !isRelay) return null;

	const endpoints = Object.values(providers).filter(
		(url) => !url.startsWith('light'),
	);

	const api = await startApi(endpoints);

	return api;
};
