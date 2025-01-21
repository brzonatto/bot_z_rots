const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const db = require('../data/db')
const rotsApi = require('../data/rotsApi')
const utils = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
            .setName('find')
            .setDescription('Search for the specified player.')
            .addStringOption(option =>  
                option.setName('nickname')
                    .setDescription('nickname of the player to be searched.')
                    .setRequired(true)
                ), 

    async execute(interaction) {   
        const nickName = interaction.options.getString('nickname')  
        const playerFirstFind = await rotsApi.findIDPlayer(nickName)        
        if (playerFirstFind.length < 1) return  await interaction.reply('Character not found.')
        const character =  await rotsApi.findPlayerByID(playerFirstFind[0].id)
        const ifNameExists = await db.findPlayerByNameIgnoreCase(nickName)
        let pvpType

        if (ifNameExists) {
            pvpType = await db.findTypePlayerByID(character.id)
        } else {
            pvpType = 'unregistered'
        }

        const card = new EmbedBuilder()
	        .setColor(utils.setPvpColor(pvpType))
	        .setTitle(`${character.name} - ${character.level}`)
	        .setURL(`https://saiyansreturn.com/profile/${playerFirstFind[0].id}?server=Universe%20Beerus`)
	        .setDescription(`${utils.setClass(character.vocation.name)} - ${character.vocation.name}`)
	        .setThumbnail(utils.setTumb(character.vocation.name))
	        .addFields(
		        { name: 'Last login', value: `${utils.convertTimestamp(character.last_login)}`, inline: true },                
		        { name: '\u200B', value: '\u200B' },
		        { name: 'Fist', value: `${character.skills.fist.level}`, inline: true },
		        { name: 'Focus', value: `${character.skills.focus.level}`, inline: true },
                { name: 'Agility', value: `${character.skills.agility.level}`, inline: true },
                { name: 'Weapon', value: `${character.skills.weapon.level}`, inline: true },
                { name: 'Speed', value: `${character.skills.movement_speed.level}`, inline: true },
                { name: 'Defense', value: `${character.skills.defense.level}`, inline: true },
                { name: 'Attack Speed', value: `${character.skills.attack_speed.level}`, inline: true },
                { name: 'EXP Boost', value: `${playerFirstFind[0].exp_boost}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Last 3 Death', value: `${utils.convertTimestamp(character.deaths.deaths[0].time)} by ${character.deaths.deaths[0].killed_by} ${character.deaths.deaths[0].killed_by != character.deaths.deaths[0].mostdamage_by ? 'and ' + character.deaths.deaths[0].mostdamage_by : ''} 
                                                    \n ${utils.convertTimestamp(character.deaths.deaths[1].time)} by ${character.deaths.deaths[1].killed_by} ${character.deaths.deaths[1].killed_by != character.deaths.deaths[1].mostdamage_by ? 'and ' + character.deaths.deaths[1].mostdamage_by : ''}
                                                    \n ${utils.convertTimestamp(character.deaths.deaths[2].time)} by ${character.deaths.deaths[1].killed_by} ${character.deaths.deaths[1].killed_by != character.deaths.deaths[1].mostdamage_by ? 'and ' + character.deaths.deaths[1].mostdamage_by : ''}`}                                
	        )
                
        await interaction.reply({ embeds: [card] })
    }
}