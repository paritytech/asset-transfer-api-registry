/* eslint-disable-next-line */
import REGISTRY from '../docs/registry.json' assert { type: 'json' };
import { PROD_REGISTRY_FILE_PATH } from './consts.js';
import { main } from './createRegistry.js';
import type { TokenRegistry } from './types.js';

void (async () => {
	try {
		await main(PROD_REGISTRY_FILE_PATH, REGISTRY as unknown as TokenRegistry);
	} catch (err) {
		console.error(err);
		process.exit(1);
	} finally {
		process.exit();
	}
})();
