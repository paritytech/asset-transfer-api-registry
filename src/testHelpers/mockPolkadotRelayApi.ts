// Copyright 2024 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { polkadotV10800 } from './metadata/polkadotV10800';

export const mockPolkadotApi = createApiWithAugmentations(polkadotV10800);
