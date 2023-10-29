const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	dataa: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),
	async execute(interaction) {
		await interaction.reply('Pong: ');
	},
};