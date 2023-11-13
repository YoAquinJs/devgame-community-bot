import { Client, Collection, GatewayIntentBits, Command } from 'discord.js';

import { logger } from './utils/logger.js';
import { loadFiles } from './filesLoader.js';
import { testDBConnection } from './database/connection.js';

if (!process.env.TOKEN) {
	logger.error('Missing Discord bot Token');
	process.exit(1);
}

testDBConnection();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection<string,Command>();
loadFiles('commands', 'data', 'execute').forEach((cmd) => {
	client.commands.set(cmd.data.name, cmd);
});

loadFiles('events', 'name', 'execute').forEach((event => {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}));

console.log(process.env.TOKEN)
client.login(process.env.TOKEN);