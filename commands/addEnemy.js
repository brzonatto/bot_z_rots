const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const db = require('../data/db');
const rotsApi = require('../data/rotsApi');
const dotenv = require('dotenv');
dotenv.config();
const { CHANNEL_ADMIN_COMMANDS_ID, REQUIRED_ROLE_ID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addenemy')
        .setDescription('Insert a new enemy.')
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('Nickname of the enemy.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('guildname')
                .setDescription('Name enemy guild.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const memberRoles = interaction.member.roles;

        // Verificação de permissão (antes de deferReply)
        if (!memberRoles.cache.has(REQUIRED_ROLE_ID)) {
            return await interaction.reply({
                content: `You do not have the required role to use this command.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Verificação de canal permitido
        if (interaction.channelId !== CHANNEL_ADMIN_COMMANDS_ID) {
            return await interaction.reply({
                content: `This command can only be used in the channel <#${CHANNEL_ADMIN_COMMANDS_ID}>.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Defere a resposta (ephemeral)
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const guildName = interaction.options.getString('guildname');
        const nickName = interaction.options.getString('nickname');

        try {
            const playerFirstFind = await rotsApi.findByName(nickName);
            if (!playerFirstFind || playerFirstFind.length < 1) {
                return await interaction.editReply('❌ Character not found.');
            }

            const character = await rotsApi.findPlayerByID(playerFirstFind[0].id);
            const ifIDExists = await db.findPlayerByID(character.id);

            if (ifIDExists) {
                const pvpType = await db.findTypePlayerByID(character.id);
                if (pvpType === 'Ally') {
                    return await interaction.editReply('⚠️ This player is already registered as Ally.');
                }
                return await interaction.editReply('⚠️ Enemy already registered.');
            }

            // Inserção do inimigo
            character.guild_name = guildName;
            character.pvp_type = 'Enemy';
            await db.insert(character);

            return await interaction.editReply(`✅ Enemy inserted: **${nickName}**`);
        } catch (error) {
            console.error("Erro ao adicionar Enemy:", error);
            return await interaction.editReply('❌ An error occurred while inserting the enemy.');
        }
    },
};
