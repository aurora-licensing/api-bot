import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { executeQuery } from '../db.js';

const create = () => {
    return new SlashCommandBuilder()
        .setName('resetsecret')
        .setDescription('Reset the secret key for this guild.');
};

const invoke = async (interaction) => {
    const guildId = interaction.guild.id;

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true });

    try {
        // Check if a secret key is already set for this guild
        const existingSecret = await executeQuery(`SELECT * FROM guild_secrets WHERE guild_id = '${guildId}'`);
        if (existingSecret.length === 0) {
            return interaction.reply({ content: 'No secret key is set for this guild.', ephemeral: true });
        }

        // Reset the secret key to null in the database
        await executeQuery(`UPDATE guild_secrets SET secret_key = NULL WHERE guild_id = '${guildId}'`);

        await interaction.reply({ content: 'Secret key reset successfully for this guild!', ephemeral: true });
    } catch (error) {
        console.error('Error resetting secret key:', error);
        await interaction.reply({ content: 'An error occurred while resetting the secret key.', ephemeral: true });
    }
};

export { create, invoke };
