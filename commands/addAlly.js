const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const db = require("../data/db");
const rotsApi = require("../data/rotsApi");
const dotenv = require("dotenv");
dotenv.config();
const { CHANNEL_ADMIN_COMMANDS_ID, REQUIRED_ROLE_ID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addally")
        .setDescription("Insert a new ally.")
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
        ),

    async execute(interaction) {
        const memberRoles = interaction.member.roles;
        if (!memberRoles.cache.has(REQUIRED_ROLE_ID)) {
            return await interaction.reply({
                content: `You do not have the required role to use this command.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (interaction.channelId !== CHANNEL_ADMIN_COMMANDS_ID) {
            return await interaction.reply({
                content: `This command can only be used in the channel <#${CHANNEL_ADMIN_COMMANDS_ID}>.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const nickName = interaction.options.getString("nickname");
        const memberID = interaction.options.getString("idmember");

        try {
            const playerFirstFind = await rotsApi.findByName(nickName);
            if (!playerFirstFind || playerFirstFind.length < 1) {
                return await interaction.editReply("❌ Character not found.");
            }

            const character = await rotsApi.findPlayerByID(playerFirstFind[0].id);
            const ifIDExists = await db.findPlayerByID(character.id);

            if (ifIDExists) {
                const pvpType = await db.findTypePlayerByID(character.id);
                if (pvpType === "Enemy") {
                    return await interaction.editReply("⚠️ This player is already registered as Enemy.");
                }
                return await interaction.editReply("⚠️ Ally already registered.");
            }

            character.memberID = memberID;
            character.pvp_type = "Ally";
            await db.insert(character);

            return await interaction.editReply(`✅ Ally inserted: **${nickName}**`);
        } catch (error) {
            console.error("Erro ao adicionar Ally:", error);
            return await interaction.editReply("❌ An error occurred while inserting the ally.");
        }
    },
};
