const {
    SlashCommandBuilder,
} = require("discord.js");
const tiers = require("../data/tiers");
const utils = require('../utils')

const statusArray = tiers.tiers().map((item) => ({
    name: item.name,
    value: item.name,
}));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("convertstatusitem")
        .setDescription("Convert item status.")
        .addStringOption((option) =>
            option
                .setName("tier")
                .setDescription("Select tier.")
                .setRequired(true)
                .addChoices([
                    {
                        name: "Tier 1",
                        value: "Tier1",
                    },
                    {
                        name: "Tier 2",
                        value: "Tier2",
                    },
                    {
                        name: "Tier 3",
                        value: "Tier3",
                    },
                    {
                        name: "Tier 4",
                        value: "Tier4",
                    },
                    {
                        name: "Tier 5",
                        value: "Tier5",
                    },
                ])
        )
        .addStringOption((option) =>
            option
                .setName("currentstatusname")
                .setDescription("Select current status name.")
                .setRequired(true)
                .addChoices(statusArray)
        )        
        .addStringOption((option) =>
            option
                .setName("valuebonus")
                .setDescription("Value of the bonus.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("statusnametoconvert")
                .setDescription("Select status name to convert.")
                .setRequired(true)
                .addChoices(statusArray)
        ),

    async execute(interaction) {
        const tier = interaction.options.getString("tier");
        const currentStatusName =
            interaction.options.getString("currentstatusname");
        const statusNameToConvert = interaction.options.getString(
            "statusnametoconvert"
        );
        const valueBonus = utils.formatBonusValue(interaction.options.getString('valuebonus'))

        const result = tiers.convertBonus(tier, currentStatusName, statusNameToConvert, valueBonus)

        await interaction.reply({ embeds: [result]});
    },
};
