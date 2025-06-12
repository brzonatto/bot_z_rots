import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, Collection, MessageFlags, Options } from "discord.js";
import { Command } from "../../struct/types/Command";
import components from "../../events/main/components";
import { FindByName } from "../../api/rotsAPI";


export default new Command({
    name: "findsss",
    description: "Search for the specified player.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nickname",
            description: "The nickname of the character to search for.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async run({interaction, options}){
        const nickName = options.getString("nickname", true);

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const character = await FindByName(nickName);

        interaction.editReply({
            content: "Searching for player......"
        });
    },    
})