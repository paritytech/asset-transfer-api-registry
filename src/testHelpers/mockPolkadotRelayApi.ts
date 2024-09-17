// Copyright 2024 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { polkadotV1002007 } from './metadata/polkadotV1002007';

export const mockPolkadotApi = createApiWithAugmentations(polkadotV1002007);
