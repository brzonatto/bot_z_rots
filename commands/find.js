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
        try {
            // Defer reply para ganhar tempo e evitar timeout da interação
            await interaction.deferReply()

            const nickName = interaction.options.getString('nickname')
            const playerFirstFind = await rotsApi.findByName(nickName)
            
            if (playerFirstFind.length < 1) {
                // Edita a resposta já deferida para informar que não achou
                return await interaction.editReply('Character not found.')
            }

            const character = await rotsApi.findPlayerByID(playerFirstFind[0].id)
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
                    { name: 'Last login', value: `${utils.convertTimestamp(character.last_login - 10800)}`, inline: true },
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
                    {
                        name: 'Last 3 Death',
                        value: character.deaths?.deaths?.slice(0, 3).map(death => {
                            if (!death) return null;
                            const killedBy = death.killed_by || 'unknown';
                            const mostDamageBy = death.mostdamage_by && death.mostdamage_by !== killedBy
                                ? ` and ${death.mostdamage_by}`
                                : '';
                            return `${utils.convertTimestamp(death.time - 10800)} by ${killedBy}${mostDamageBy}`;
                        }).filter(Boolean).join('\n') || 'No deaths recorded',
                    }
                );

            // Edita a resposta diferida com o embed final
            await interaction.editReply({ embeds: [card] })
        } catch (error) {
            console.error('Erro no comando find:', error)
            if (interaction.deferred || interaction.replied) {
                // Se já respondeu algo, edita para mensagem de erro
                await interaction.editReply('Ocorreu um erro ao processar o comando.')
            } else {
                // Se ainda não respondeu, responde diretamente
                await interaction.reply('Ocorreu um erro ao processar o comando.')
            }
        }
    }
}
