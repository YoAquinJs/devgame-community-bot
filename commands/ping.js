const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),
	async execute(interaction) {
		const roundTripLatency = interaction.createdTimestamp - Date.now();

		await interaction.reply(`Pong: ${roundTripLatency}ms`);
	},
};