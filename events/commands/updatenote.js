// Import required modules and functions
import axios from 'axios';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { executeQuery } from '../db.js';

const create = () => {
    return new SlashCommandBuilder()
        .setName('updatenote')
        .setDescription('Update the note of an existing license.')
        .addStringOption(option => option.setName('key').setDescription('The license key').setRequired(true))
        .addStringOption(option => option.setName('note').setDescription('New note').setRequired(true))
    
    return command.toJSON();
};

const invoke = async (interaction) => {
    const guildId = interaction.guild.id;

    const licenseKey = interaction.options.getString('key');
    const newNote = interaction.options.getString('note');

    // Check for administrator and send message permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true, });

    if (!interaction.appPermissions.has(PermissionFlagsBits.SendMessages))
        return interaction.reply({ content: 'I am not allowed to send messages!', ephemeral: true });

    try {
        const guildSecretResult = await executeQuery(`SELECT * FROM guild_secrets WHERE guild_id = '${guildId}'`);
        if (guildSecretResult.length === 0) {
            return interaction.reply({ content: 'A secret key is not set for this guild. Please set it using /setsecret command.', ephemeral: true });
        }

        const secretKey = guildSecretResult[0].secret_key;

        const response = await axios.get('https://aurora-licensing.pro/api/premium/index.php', {
            params: {
                action: 'updatenote',
                secret: secretKey,
                license: licenseKey,
                new_note: newNote
            }
        });

        const formattedMessage = `Response: ${response.data.message}`;

        await interaction.reply({ content: formattedMessage, ephemeral: true });
    } catch (error) {
        console.error('Error updating note:', error);
        await interaction.reply('An error occurred while updating the note.');
    }
};

export { create, invoke };