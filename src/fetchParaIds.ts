// Copyright 2023 Parity Technologies (UK) Ltd.

import { ApiPromise } from '@polkadot/api';

import type { ParaIds } from './types.js';

/**
 * This will create a registry of Parachain Ids.
 *
 * @param chain Relay chain name
 * @param endpointOpts Endpoint we are going to fetch the info from
 * @param paraIds Registry we want to add the info to
 */
export const fetchParaIds = async (
	api: ApiPromise | undefined | null,
	chain: string,
	paraIds: ParaIds,
): Promise<ParaIds> => {
	if (api !== null && api !== undefined) {
		const paras = await api.query.paras.parachains();
		const paraIdsJson = paras.toJSON();
		paraIds[chain] = paraIdsJson as number[];
		await api.disconnect();
	}

	return paraIds;
};
