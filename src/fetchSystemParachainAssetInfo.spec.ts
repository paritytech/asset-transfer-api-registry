// Copyright 2023 Parity Technologies (UK) Ltd.

import { fetchSystemParachainAssetInfo } from './fetchSystemParachainAssetInfo';
import { adjustedmockAssetHubKusamaApi } from './testHelpers/adjustedMockAssetHubKusamaApi';

describe('fetchSystemParachainAssetInfo', () => {
	it('Should correctly return the Asset Info for Asset Hub', async () => {
		const result = await fetchSystemParachainAssetInfo(
			adjustedmockAssetHubKusamaApi,
		);

		expect(result).toEqual({ '1984': 'USDt' });
	});
});
