// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { kusamaV9420 } from './metadata/kusamaV9420';

export const mockKusamaRelayApi = createApiWithAugmentations(kusamaV9420);
