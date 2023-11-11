const path = require('node:path');
const { logger } = require(path.join(path.join(__dirname, 'utils'), 'logger.js'));
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { loadFiles } = require(path.join(__dirname, 'filesLoader'));

const dotenv = require('dotenv');

dotenv.config();

if (!process.env.TOKEN) {
	logger.error('Missing Discord bot Token');
	return;
}

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