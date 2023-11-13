import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const command = {
	data: new SlashCommandBuilder()
	.setName('ping')
		.setDescription('Replies with the latency'),
	execute: async function (interaction:ChatInputCommandInteraction) {
		const roundTripLatency = interaction.createdTimestamp - Date.now();

		await interaction.reply({ content: `Pong: ${roundTripLatency}ms`, ephemeral: true });
	},
}