const { SlashCommandBuilder } = require('discord.js')
const db = require('../data/db')
const rotsApi = require('../data/rotsApi')
const dotenv = require('dotenv')
dotenv.config()
const { CHANNEL_ADMIN_COMMANDS_ID, REQUIRED_ROLE_ID } = process.env

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
            })
        }

        const guildName = interaction.options.getString('guildname');
        const nickName = interaction.options.getString('nickname');
        const playerFirstFind = await rotsApi.findByName(nickName)
        if (playerFirstFind.length < 1) return  await interaction.reply('Character not found.')
        const character =  await rotsApi.findPlayerByID(playerFirstFind[0].id)   
                           
        try {         
            const ifIDExists = await db.findPlayerByID(character.id)            
            
            if (ifIDExists) {
                const pvpType = await db.findTypePlayerByID(character.id)
                if (pvpType == 'Ally') return await interaction.reply('This player already registered as ally.')
                if (ifIDExists) return await interaction.reply('Enemy already registered.')
            } else {
                character.guild_name = guildName
                character.pvp_type = 'Enemy'            
                await db.insert(character)
            }          
        } catch (error) {
            console.error(error)
        }

        await interaction.reply(`Enemy inserted: ${nickName}`)
    }
}