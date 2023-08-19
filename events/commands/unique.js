// Import required modules and functions
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const create = () => {
    return new SlashCommandBuilder()
        .setName('unique')
        .setDescription('Create a unique license key.')
        .addStringOption(option => option.setName('mid').setDescription('Mid Text').setRequired(true))
      
    return command.toJSON();
};

const invoke = async (interaction) => {
    const Mid = interaction.options.getString('mid');

    // Check for administrator and send message permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({ content: 'You are not allowed to use this command!', ephemeral: true, });

    if (!interaction.appPermissions.has(PermissionFlagsBits.SendMessages))
        return interaction.reply({ content: 'I am not allowed to send messages!', ephemeral: true });

    try {
        const License = generateFileSecret() + `-${Mid}-` + generateFileSecret();
        const formattedMessage = `Unique License: ${License}`;

        await interaction.reply({ content: formattedMessage, ephemeral: true });
    } catch (error) {
        console.error('Error adding file:', error);
        await interaction.reply('An error occurred while generating unique license.');
    }
};

// Function to generate a unique file secret
const generateFileSecret = () => {
    const length = 15; // The desired length of the random string
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // All possible characters
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
};

export { create, invoke };
