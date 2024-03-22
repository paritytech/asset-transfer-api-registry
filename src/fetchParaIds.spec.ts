// Copyright 2024 Parity Technologies (UK) Ltd.

import { prodRelayKusama } from '@polkadot/apps-config';
import { describe, expect, it, vi } from 'vitest';

import { fetchParaIds } from './fetchParaIds.js';
import { getApi } from './getApi.js';
import { adjustedMockKusamaRelayApi } from './testHelpers/adjustedMockKusamaRelayApi.js';
import type { ParaIds } from './types.js';

vi.mock('./getApi.js', () => {
	return {
		getApi: vi.fn(),
	};
});
vi.mocked(getApi).mockResolvedValue(adjustedMockKusamaRelayApi);

describe('fetchParaIds', () => {
	it('Correctly fetches the parachain Ids for a given relay chain', async () => {
		const paraIds: ParaIds = {};

		const result = await fetchParaIds('kusama', prodRelayKusama, paraIds);

		expect(result).toEqual({
			kusama: [
				1000, 1001, 1002, 2000, 2001, 2004, 2007, 2011, 2012, 2015, 2023, 2024,
				2048, 2084, 2085, 2087, 2088, 2090, 2092, 2095, 2096, 2105, 2106, 2110,
				2113, 2114, 2119, 2121, 2123, 2124, 2125, 2222, 2236, 2239, 2241, 2257,
				2261, 2274, 2275, 2281, 2284, 3334, 3335,
			],
		});
	});
});
