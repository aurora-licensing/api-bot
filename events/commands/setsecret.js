import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { executeQuery } from '../db.js';

const create = () => {
    return new SlashCommandBuilder()
        .setName('setsecret')
        .setDescription('Set your secret key for this guild.')
        .addStringOption(option => option
        .setName('secret')
        .setDescription('Your secret key')
        .setRequired(true))

    return command.toJSON();
};

const invoke = async (interaction) => {
    const secretKey = interaction.options.getString('secret');
    const guildId = interaction.guild.id;

    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true, });

    if (!interaction.appPermissions.has(PermissionFlagsBits.SendMessages))
        return interaction.reply({ content: 'I am not allowed to send messages!', ephemeral: true });

    try {
        // Check if the secret key is already set for this guild
        const existingSecret = await executeQuery(`SELECT * FROM guild_secrets WHERE guild_id = '${guildId}'`);
        if (existingSecret.length > 0) {
            return interaction.reply({ content: 'A secret key is already set for this guild.', ephemeral: true });
        }

        // Insert the secret key into the database
        await executeQuery(`INSERT INTO guild_secrets (guild_id, secret_key) VALUES ('${guildId}', '${secretKey}')`);

        await interaction.reply({ content: 'Secret key set successfully for this guild!', ephemeral: true });
    } catch (error) {
        console.error('Error setting secret key:', error);
        await interaction.reply({ content: 'An error occurred while setting the secret key.', ephemeral: true });
    }
};

export { create, invoke };
