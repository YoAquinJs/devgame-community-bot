const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const logger = require(path.join(path.join(__dirname, 'utils'), 'logger.js')).logger;

const dotenv = require('dotenv');

dotenv.config();

let deploy;
if (process.argv.length < 3) {
	logger.error('Missing action argument "-d" for deployment "-D" for deleting');
	return;
} else if (process.argv[2] === '-d') {
	deploy = true;
} else if (process.argv[2] === '-D') {
	deploy = false;
} else {
	logger.error(`Invalid argument passed ${process.argv[2]}`);
	return;
}

let isGlobal;
if (process.argv.length < 4) {
	isGlobal = false;
} else if (process.argv[3] === 'guild') {
	isGlobal = false;
} else if (process.argv[3] === 'global') {
	isGlobal = true;
} else {
	logger.error(`Invalid argument passed ${process.argv[3]}`);
	return;
}

if (!process.env.TOKEN) {
	logger.error('Missing Discord bot Token');
	return;
}

if (!process.env.CLIENT_ID) {
	logger.error('Missing Discord bot Token');
	return;
}

let guildIDs;
if (!isGlobal) {
	if (!process.env.GUILD_IDS) {
		logger.error('Missing Guild Ids for slash command guild deploy');
		return;
	} else {
		guildIDs = process.env.GUILD_IDS.split(',');
	}
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		if (isGlobal) {
			logger.info(`Started ${deploy ? 'refreshing' : 'unregistering'} ${commands.length} application (/) commands.`);
			const data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: deploy ? commands : [] },
			);
			logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
		} else {
			guildIDs.forEach(async (guildId) => {
				logger.info(`Started ${deploy ? 'refreshing' : 'unregistering'} ${commands.length} guild ${guildId} (/) commands.`);
				const data = await rest.put(
					Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
					{ body: deploy ? commands : [] },
				);
				logger.info(`Successfully ${deploy ? 'reloaded' : 'unregister'} ${data.length} guild ${guildId} (/) commands.`);
			});
		}

	} catch (error) {
		logger.error(error);
	}
})();