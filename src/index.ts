import CURRENT_REGISTRY from '../docs/registry.json';
import { PROD_REGISTRY_FILE_PATH } from './consts';
import { DEFAULT_REGISTRY } from './consts';
import { main } from './createRegistry';
import type { TokenRegistry } from './types';

main(
	PROD_REGISTRY_FILE_PATH,
	DEFAULT_REGISTRY,
	CURRENT_REGISTRY as TokenRegistry,
)
	.catch((err) => console.error(err))
	.finally(() => process.exit());
