/* eslint-disable-next-line */
import REGISTRY from '../docs/registry.json' with { type: 'json' };
import { PROD_REGISTRY_FILE_PATH } from './consts.js';
import { main } from './createRegistry.js';
import type { TokenRegistry } from './types.js';

main(PROD_REGISTRY_FILE_PATH, REGISTRY as unknown as TokenRegistry)
	.catch((err) => console.error(err))
	.finally(() => process.exit());
