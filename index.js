const fs = require('node:fs');
const path = require('node:path');
const logger = require(path.join(path.join(__dirname, 'utils'), 'logger.js')).logger;
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();

if (!process.env.TOKEN) {
	logger.error('Missing Discord bot Token');
	return;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(error);

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Hubo un error interno en la ejecucion de este comando', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Hubo un error interno en la ejecucion de este comando', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, c => {
	logger.info(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);