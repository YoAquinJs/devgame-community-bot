import { Client, SlashCommandBuilder, Collection } from 'discord.js';

declare module 'discord.js' {
    interface Command {
        data:SlashCommandBuilder;
        execute:(interaction:ChatInputCommandInteraction) => Promise<void>
    }
    interface Client {
        commands:Collection<string,Command>;
    }
}