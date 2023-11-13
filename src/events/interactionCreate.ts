import { Events, BaseInteraction } from 'discord.js';

export const name = Events.InteractionCreate;
export async function execute(interaction:BaseInteraction) {
	if (!interaction.isChatInputCommand()) return;
	console.log(typeof interaction);
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}`);
		console.error(error);
	}
}