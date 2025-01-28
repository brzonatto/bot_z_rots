const { SlashCommandBuilder } = require("discord.js");
const db = require("../data/db");
const rotsApi = require("../data/rotsApi");
const dotenv = require("dotenv");
dotenv.config();
const { CHANNEL_ADMIN_COMMANDS_ID, REQUIRED_ROLE_ID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("updateidmember")
        .setDescription("Update a new ally.")
        .addStringOption((option) =>
            option
                .setName("nickname")
                .setDescription("Nickname of the ally.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("idmember")
                .setDescription("ID discord member.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const memberRoles = interaction.member.roles;
        if (!memberRoles.cache.has(REQUIRED_ROLE_ID)) {
            return await interaction.reply({
                content: `You do not have the required role to use this command.`,
                ephemeral: true,
            });
        }

        if (interaction.channelId !== CHANNEL_ADMIN_COMMANDS_ID) {
            return await interaction.reply({
                content: `This command can only be used in the channel <#${CHANNEL_ADMIN_COMMANDS_ID}>.`,
                ephemeral: true,
            });
        }

        const nickName = interaction.options.getString("nickname");
        const memberID = interaction.options.getString("idmember");

        try {
            const character = await db.findPlayerByNameIgnoreCase(nickName);
            if (!character) {
                return await interaction.reply("Character not found.");
            } else {
                await db.update({ id: character.id }, { memberID: memberID });
            }
        } catch (error) {
            console.error(error);
        }

        await interaction.reply(`Ally updated: ${nickName}`);
    },
};
