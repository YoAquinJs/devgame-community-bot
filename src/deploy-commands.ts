/* Command executer:
node deploy-commands.js -d
*/

import { join, resolve } from 'path';
import { config } from 'dotenv';
config({ path:join(resolve(__dirname, '..'), '.env') });

import { REST, Routes } from 'discord.js';

import { logger } from './utils/logger.js';
import { loadFiles } from './filesLoader.js';
import { validateEnvVars, allowedTypes } from './utils/validate-env-vars.js';

let deploy:boolean;
if (process.argv.length < 3) {
	logger.error('Missing action argument "-d" for deployment "-D" for deleting');
	process.exit(1);
} else if (process.argv[2] === '-d') {
	deploy = true;
} else if (process.argv[2] === '-D') {
	deploy = false;
} else {
	logger.error(`Invalid argument passed ${process.argv[2]}`);
	process.exit(1);
}

let isGlobal:boolean;
if (process.argv.length < 4) {
	isGlobal = false;
} else if (process.argv[3] === 'guild') {
	isGlobal = false;
} else if (process.argv[3] === 'global') {
	isGlobal = true;
} else {
	logger.error(`Invalid argument passed ${process.argv[3]}`);
	process.exit(1);
}

const requiredEnvVars:{name:string,type:allowedTypes}[] = [
	{name:'TOKEN', type:'string'},
	{name:'GUILD_IDS', type:'string'},
	{name:'CLIENT_ID', type:'string'},
];
validateEnvVars(requiredEnvVars)

const commands = loadFiles('commands', 'data', 'execute').map((cmd) => cmd.data.toJSON());

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		if (isGlobal) {
			logger.info(`Started ${deploy ? 'refreshing' : 'unregistering'} ${commands.length} application (/) commands.`);
			const data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: deploy ? commands : [] },
			);
			logger.info(`Successfully reloaded ${(data as any).length} application (/) commands.`);
		} else {
			const guildIDs = process.env.GUILD_IDS.split(',');
			guildIDs.forEach(async (guildId) => {
				logger.info(`Started ${deploy ? 'refreshing' : 'unregistering'} ${commands.length} guild ${guildId} (/) commands.`);
				const data = await rest.put(
					Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
					{ body: deploy ? commands : [] },
				);
				logger.info(`Successfully ${deploy ? 'reloaded' : 'unregister'} ${commands.length - (data as any).length} guild ${guildId} (/) commands.`);
			});
		}

	} catch (error) {
		logger.error(error);
	}
})();