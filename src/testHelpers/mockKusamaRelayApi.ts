// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { kusamaV1003000 } from './metadata/kusamaV1003000';

export const mockKusamaRelayApi = createApiWithAugmentations(kusamaV1003000);
