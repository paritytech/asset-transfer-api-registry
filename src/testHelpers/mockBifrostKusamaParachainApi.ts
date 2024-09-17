// Copyright 2023 Parity Technologies (UK) Ltd.

import { createApiWithAugmentations } from './createApiWithAugmentations';
import { bifrostKusamaV12000 } from './metadata/bifrostKusamaV12000';

export const mockBifrostKusamaParachainApi =
	createApiWithAugmentations(bifrostKusamaV12000);
