// Copyright 2023 Parity Technologies (UK) Ltd.

import { fetchSystemParachainForeignAssetInfo } from './fetchSystemParachainForeignAssetInfo.js';
import { adjustedmockAssetHubKusamaApi } from './testHelpers/adjustedMockAssetHubKusamaApi.js';

describe('fetchSystemParachainForeignAssetInfo', () => {
	it('Should correctly return the Foreign Asset Info for Asset Hub', async () => {
		const result = await fetchSystemParachainForeignAssetInfo(
			adjustedmockAssetHubKusamaApi,
		);

		expect(result).toEqual({
			TNKR: {
				multiLocation:
					'{"parents":"1","interior":{"X2":[{"Parachain":"2125"},{"GeneralIndex":"0"}]}}',
				name: 'Tinkernet',
				symbol: 'TNKR',
			},
		});
	});
});
