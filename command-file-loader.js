const fs = require('node:fs');
const path = require('node:path');
const logger = require(path.join(path.join(__dirname, 'utils'), 'logger.js')).logger;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		commands.push(command);
	} else {
		logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

module.exports = {
	commands : commands,
};