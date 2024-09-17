// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { assetHubKusamaV1003000 } from './metadata/assetHubKusamaV1003000';

export const mockAssetHubKusamaApi = createApiWithAugmentations(
	assetHubKusamaV1003000,
);
