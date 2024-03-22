// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import type { ParaIds } from './types.js';
import { EndpointOption } from '@polkadot/apps-config/endpoints/types.js';
import { getApi } from './getApi.js';

/**
 * This will create a registry of Parachain Ids.
 *
 * @param chain Relay chain name
 * @param endpointOpts Endpoint we are going to fetch the info from
 * @param paraIds Registry we want to add the info to
 */
export const fetchParaIds = async (
	chain: string,
	endpointOpts: EndpointOption,
	paraIds: ParaIds,
): Promise<ParaIds> => {
	const api = await getApi(endpointOpts, chain, true);

	if (api !== null && api !== undefined) {
		const paras = await api.query.paras.parachains();
		const paraIdsJson = paras.toJSON();
		paraIds[chain] = paraIdsJson as number[];
		await api.disconnect();
	}

	return paraIds;
};
