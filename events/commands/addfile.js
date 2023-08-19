// Import required modules and functions
import axios from 'axios';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { executeQuery } from '../db.js';

const create = () => {
    return new SlashCommandBuilder()
        .setName('addfile')
        .setDescription('Add a file with a link.')
        .addStringOption(option => option.setName('file_name').setDescription('File name').setRequired(true))
        .addStringOption(option => option.setName('file_link').setDescription('File link').setRequired(true))
      
    return command.toJSON();
};

const invoke = async (interaction) => {
    const guildId = interaction.guild.id;

    const fileName = interaction.options.getString('file_name');
    const fileLink = interaction.options.getString('file_link');

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
                action: 'addfile',
                secret: secretKey,
                file_name: fileName,
                file_secret: generateFileSecret(), // Define a function to generate unique file secrets
                file_link: fileLink
            }
        });

        const formattedMessage = `Response: ${response.data.message}`;

        await interaction.reply({ content: formattedMessage, ephemeral: true });
    } catch (error) {
        console.error('Error adding file:', error);
        await interaction.reply('An error occurred while adding the file.');
    }
};

// Function to generate a unique file secret
const generateFileSecret = () => {
    const length = 50; // The desired length of the random string
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // All possible characters
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
};

export { create, invoke };
