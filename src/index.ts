import REGISTRY from '../docs/registry.json';
import { PROD_REGISTRY_FILE_PATH } from './consts';
import { main } from './createRegistry';
import type { TokenRegistry } from './types';

main(PROD_REGISTRY_FILE_PATH, REGISTRY as unknown as TokenRegistry)
	.catch((err) => console.error(err))
	.finally(() => process.exit());
