const { SlashCommandBuilder } = require("discord.js");
const db = require("../data/db");
const utils = require(`../utils`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warstatistics")
        .setDescription("Creates war statistics.")
        .addStringOption((option) =>
            option
                .setName("starttime")
                .setDescription("Start of the period to generate statistics.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("endtime")
                .setDescription("End of the period to generate statistics.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("enemyguild")
                .setDescription("Get data from a specific enemy guild.")
        )
        .addStringOption((option) =>
            option
                .setName("allyguild")
                .setDescription("Get data from a specific ally guild.")
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const startTime = await utils.convertToTimestamp(
                interaction.options.getString("starttime")
            );
            const endTime = await utils.convertToTimestamp(
                interaction.options.getString("endtime")
            );

            if (!startTime || !endTime) {
                throw new Error("Invalid start or end time provided.");
            }

            const enemyGuild = interaction.options.getString("enemyguild");
            const allyGuild = interaction.options.getString("allyguild");
            const enemies = await db.listEnemies(enemyGuild);
            const allies = await db.listAllies(allyGuild);

            if (!enemies || !allies) {
                throw new Error("Unable to fetch data for allies or enemies.");
            }

            const statsAlliesResult = await utils.calcWarStatistics(
                enemies,
                allies,
                startTime,
                endTime
            );
            const statsEnemmiesResult = await utils.calcWarStatistics(
                allies,
                enemies,
                startTime,
                endTime
            );

            const imageBufferAllies = await utils.generateTableImage(statsAlliesResult);
            const imageBufferEnemies = await utils.generateTableImage(
                statsEnemmiesResult
            );

            const totalDeathsAllies = await utils.countTotalDeaths(statsAlliesResult);
            const totalDeathsEnemies = await utils.countTotalDeaths(
                statsEnemmiesResult
            );

            const stats = [
                `General Statistics`,
                `${interaction.options.getString(
                    "starttime"
                )} - ${interaction.options.getString("endtime")}`,
                `Total Allies ${statsAlliesResult.length} x ${statsEnemmiesResult.length} Total Enemies`,
                `Allies score ${totalDeathsEnemies} x ${totalDeathsAllies} Enemies score`,
            ];

            const merge = await utils.mergeImagesWithStats(
                imageBufferAllies,
                imageBufferEnemies,
                stats
            );

            await interaction.editReply({
                files: [{ attachment: merge, name: "warStatistics.png" }],
            });
        } catch (error) {
            console.error("Error in command:", error);
            await interaction.editReply({
                content: "An error occurred while processing war statistics. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
