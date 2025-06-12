import { EmbedBuilder } from "discord.js";
import { CharacterMap } from "../mappers/CharacterMap";
import { ConvertTimestamp, SetClass, SetPvpColor, SetTumb } from "../../functions/utils";

export const characterFindEmbed = (character: CharacterMap): EmbedBuilder => {
    const embed = new EmbedBuilder()
        .setColor(SetPvpColor("Enemy"))
        .setTitle(`${character.name} - ${character.level}`)
        .setURL(`https://saiyansreturn.com/profile/${character.id}?server=Universe%20Beerus`)
        .setDescription(`${SetClass(character.vocation.name)} - ${character.vocation.name}`)
        .setThumbnail(SetTumb(character.vocation.name))
        .addFields(
            { name: `🕰️ Last login: ${ConvertTimestamp(character.lastLogin - 10800)}`, value: ``, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: `✋ Fist: ${character.skills.fist}`, value: ``, inline: false },
            { name: `🪄 Focus: ${character.skills.focus}`, value: ``, inline: false },
            { name: `🤸‍♂️ Agility: ${character.skills.agility}`, value: ``, inline: false },
            { name: `🗡️ Weapon: ${character.skills.weapon}`, value: ``, inline: false },
            { name: `🏃‍♂️‍➡️ Speed: ${character.skills.movementSpeed}`, value: ``, inline: false },
            { name: `🛡️ Defense: ${character.skills.defense}`, value: ``, inline: false },
            { name: `⚔️ Attack Speed: ${character.skills.attackSpeed}`, value: ``, inline: false },
            { name: `✨ EXP Boost: ${character.expBoost}`, value: ``, inline: false },
            { name: '\u200B', value: '\u200B' },
            {
                name: '💀 Last 3 Death',
                value: character.deaths?.slice(0, 3).map(death => {
                    if (!death) return null;
                    const killedBy = death.killedBy || 'unknown';
                    const mostDamageBy = death.mostdamageBy && death.mostdamageBy !== killedBy
                        ? ` and ${death.mostdamageBy}`
                        : '';
                    return `${ConvertTimestamp(death.time - 10800)} by ${killedBy}${mostDamageBy}`;
                }).filter(Boolean).join('\n') || 'No deaths recorded'
            }
        );
    return embed;
};