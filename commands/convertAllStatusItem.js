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
        .setName("convertallstatusitem")
        .setDescription("Convert item status.") 
        .addStringOption((option) =>
            option
                .setName("lookitem")
                .setDescription("Paste look item.")
        )       
        .addStringOption((option) =>
            option
                .setName("statusname1")
                .setDescription("Select status 1 name.")
                .addChoices(statusArray)
        )
        .addStringOption((option) =>
            option
                .setName("statusname2")
                .setDescription("Select status name 2.")
                .addChoices(statusArray)
        )
        .addStringOption((option) =>
            option
                .setName("statusname3")
                .setDescription("Select status name 3.")
                .addChoices(statusArray)
        )
        .addStringOption((option) =>
            option
                .setName("statusname4")
                .setDescription("Select status name 4.")
                .addChoices(statusArray)
        ),

    async execute(interaction) {
        let statusNames = [];
        const tier = interaction.options.getString("lookitem");
        const statusName1 = interaction.options.getString("statusname1");
        const statusName2 = interaction.options.getString("statusname2");
        const statusName3 = interaction.options.getString("statusname3");
        const statusName4 = interaction.options.getString("statusname4");

        statusNames.push(statusName1)
        statusNames.push(statusName2)
        statusNames.push(statusName3)
        statusNames.push(statusName4)


        const bonuses = utils.extractBonuses(tier)

        // const embed1 = new EmbedBuilder();
        // const embed2 = new EmbedBuilder();



        const results = tiers.convertAllBonus(bonuses, statusNames)

        // const statusNameToConvert = interaction.options.getString(
        //     "statusnametoconvert"
        // );
        //const valueBonus = utils.formatBonusValue(interaction.options.getString('valuebonus'))

        //const result = tiers.convertBonus(tier, currentStatusName, statusNameToConvert, valueBonus)

        // await interaction.reply(`Ally inserted: ${nickName}`);
        await interaction.reply({ embeds: results });
    },
};
