// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { assetHubKusamaV10400 } from './metadata/assetHubKusamaV10400';

export const mockAssetHubKusamaApi =
	createApiWithAugmentations(assetHubKusamaV10400);
