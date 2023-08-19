import axios from 'axios';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { executeQuery } from '../db.js';

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('createlicense')
        .setDescription('Create a new aurora license.')
        .addStringOption(option => option.setName('key').setDescription('Reason for the ban').setRequired(true))
        .addStringOption(option => option.setName('level').setDescription('Reason for the ban').setRequired(true))
        .addStringOption(option => option.setName('note').setDescription('Reason for the ban').setRequired(true))
        .addIntegerOption(option => option.setName('days').setDescription('Number of days').setRequired(true));

    return command.toJSON();
};

const invoke = async (interaction) => {
    const guildId = interaction.guild.id;

    const licenseKey = interaction.options.getString('key');
    const subLevel = interaction.options.getString('level');
    const note = interaction.options.getString('note');
    const days = interaction.options.getInteger('days');

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
                action: 'create',
                secret: secretKey,
                license: licenseKey,
                sub: subLevel,
                note: note,
                days: days
            }
        });

        // Extract individual data from the response object
        const { message, license_key, license_id } = response.data;

        // Construct the formatted message
        const formattedMessage = `Response: ${message}\nLicense key: ${license_key}\nLicense id: ${license_id}`;

        await interaction.reply({ content: formattedMessage, ephemeral: true });
        //await interaction.reply({ content: `License created: ${JSON.stringify(response.data)}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating license:', error);
        await interaction.reply('An error occurred while creating the license.');
    }
};

export { create, invoke };