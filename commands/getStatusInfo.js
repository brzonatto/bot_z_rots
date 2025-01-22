const {
    SlashCommandBuilder,
} = require("discord.js");
const tiers = require("../data/tiers");

const statusArray = tiers.tiers().map((item) => ({
    name: item.name,
    value: item.name,
}));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getstatusinfo")
        .setDescription("fetches status data.")        
        .addStringOption((option) =>
            option
                .setName("statusname")
                .setDescription("Select status name.")
                .setRequired(true)
                .addChoices(statusArray)
        ),     
        

    async execute(interaction) {
        const statusName = interaction.options.getString("statusname");
        const result = tiers.getStatusInfoEmbed(statusName)
        await interaction.reply({ embeds: [result]});
    },
};
