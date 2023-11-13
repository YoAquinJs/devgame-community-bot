import { SlashCommandBuilder, ChatInputCommandInteraction, Command } from 'discord.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('command')
		.setDescription('Replies with the latency')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Description')),
	execute: async function (interaction:ChatInputCommandInteraction) {
		const roundTripLatency = interaction.createdTimestamp - Date.now();

		await interaction.reply({ content: `Pong: ${roundTripLatency}ms`, ephemeral: true });
	}
}