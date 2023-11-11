const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('command')
		.setDescription('Replies with the latency')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Description')),
	async execute(interaction) {
		const roundTripLatency = interaction.createdTimestamp - Date.now();

		await interaction.reply({ content: `Pong: ${roundTripLatency}ms`, ephemeral: true });
	},
};