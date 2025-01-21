const { SlashCommandBuilder } = require('discord.js')
const db = require('../data/db')
const rotsApi = require('../data/rotsApi')
const dotenv = require('dotenv')
dotenv.config()
const { CHANNEL_ADMIN_COMMANDS_ID, REQUIRED_ROLE_ID } = process.env

module.exports = {
    data: new SlashCommandBuilder()
            .setName('addally')
            .setDescription('Insert a new ally.')
            .addStringOption(option =>  
                option.setName('nickname')
                    .setDescription('Nickname of the ally.')
                    .setRequired(true)
                ),    

    async execute(interaction) {        
        const memberRoles = interaction.member.roles
        if (!memberRoles.cache.has(REQUIRED_ROLE_ID)) {
            return await interaction.reply({
                content: `You do not have the required role to use this command.`,
                ephemeral: true,
            })
        }

        if (interaction.channelId !== CHANNEL_ADMIN_COMMANDS_ID) {
            return await interaction.reply({
                content: `This command can only be used in the channel <#${CHANNEL_ADMIN_COMMANDS_ID}>.`,
                ephemeral: true,
            });
        }

        const nickName = interaction.options.getString('nickname');
        const playerFirstFind = await rotsApi.findIDPlayer(nickName)
        if (playerFirstFind.length < 1) return  await interaction.reply('Character not found.')
        const character =  await rotsApi.findPlayerByID(playerFirstFind[0].id)         
            
        try {
            const ifIDExists = await db.findPlayerByID(character.id)

            if (ifIDExists) {
                const pvpType = await db.findTypePlayerByID(character.id)
                if (pvpType == 'Enemy') return await interaction.reply('This player already registered as Enemy.')
                if (ifIDExists) return await interaction.reply('Ally already registered.')
            } else {
                character.pvp_type = 'Ally'            
                await db.insert(character)
            }
        } catch (error) {
            console.error(error)
        }

        await interaction.reply('Ally inserted')
    }
}