// Copyright 2024 Parity Technologies (UK) Ltd.

import { describe, expect, it } from 'vitest';

import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo.js';
import { adjustedmockAssetHubKusamaApi } from './testHelpers/adjustedMockAssetHubKusamaApi.js';

describe('fetchSystemParachainForeignAssetInfo', () => {
	it('Should correctly return the Foreign Asset Info for Asset Hub', async () => {
		const result = await fetchSystemParachainForeignAssetInfo(
			adjustedmockAssetHubKusamaApi,
			0,
		);

		expect(result).toEqual({
			TNKR: {
				multiLocation:
					'{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
				name: 'Tinkernet',
				symbol: 'TNKR',
				reserveLocations: [
					'{"parents":"0","interior":{"X1":{"Parachain":"1000"}}}',
					'{"parents":"1","interior":{"X1":{"Parachain":"2125"}}}',
				],
			},
		});
	});
});
