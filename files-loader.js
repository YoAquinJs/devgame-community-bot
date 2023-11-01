const fs = require('node:fs');
const path = require('node:path');
const logger = require(path.join(path.join(__dirname, 'utils'), 'logger.js')).logger;


module.exports = {
	loadFiles(folder, ...requiredKeys) {
		const files = [];
		const folderPath = path.join(__dirname, folder);
		const filesPaths = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

		for (const f of filesPaths) {
			const filePath = path.join(folderPath, f);
			const file = require(filePath);

			requiredKeys.forEach((key) => {
				if (!(key in file)) {
					logger.warn(`The file at ${filePath} is missing ${key} property.`);
				}
			});
			files.push(file);
		}

		return files;
	},
};