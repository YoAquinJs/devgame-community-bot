import { readdirSync } from 'fs'
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';


import { logger } from './utils/logger.js';

export function loadFiles(folder:string, ...requiredKeys:string[]) {
	const files = [];
	const folderPath = join(dirname(fileURLToPath(import.meta.url)), folder);
	const filesPaths = readdirSync(folderPath).filter(file => file.endsWith('.js'));

	for (const f of filesPaths) {
		const filePath = `./${folder}/${f}`;

		import(filePath).then(file => {
			requiredKeys.forEach((key) => {
				if (!(key in file)) {
					logger.warn(`The file at ${filePath} is missing ${key} property.`);
				}
			});
			files.push(file);
		});

		// Wait until the previous file import is resolved
	}

	return files;
}