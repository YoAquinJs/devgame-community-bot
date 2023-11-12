const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path:path.join(path.resolve(__dirname, '..'), '.env') });

const { Client, Collection, GatewayIntentBits } = require('discord.js');

const { logger } = require('./utils/logger.js');
const { loadFiles } = require('./filesLoader.js');
const { testDBConnection } = require('./database/connection.js');

if (!process.env.TOKEN) {
	logger.error('Missing Discord bot Token');
	return;
}

testDBConnection();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
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

client.login(process.env.TOKEN);