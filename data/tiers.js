const { EmbedBuilder } = require("discord.js");

const tiers = () => {
    return [
        {
            name: "Health",
            tiers: {
                Tier1: { Min: 50, Max: 100 },
                Tier2: { Min: 105, Max: 175 },
                Tier3: { Min: 180, Max: 250 },
                Tier4: { Min: 255, Max: 350 },
                Tier5: { Min: 355, Max: 500 },
                Max: 2500,
                FutureMax: 1923,
            },
        },
        {
            name: "Ki",
            tiers: {
                Tier1: { Min: 50, Max: 100 },
                Tier2: { Min: 105, Max: 175 },
                Tier3: { Min: 180, Max: 250 },
                Tier4: { Min: 255, Max: 350 },
                Tier5: { Min: 355, Max: 500 },
                Max: 2500,
                FutureMax: 1923,
            },
        },
        {
            name: "Life Drain",
            tiers: {
                Tier1: { Min: 6, Max: 12 },
                Tier2: { Min: 16.6, Max: 21 },
                Tier3: { Min: 21.6, Max: 30 },
                Tier4: { Min: 30.6, Max: 42 },
                Tier5: { Min: 42.6, Max: 60 },
                Max: 300,
                FutureMax: 230,
            },
        },
        {
            name: "Ki Drain",
            tiers: {
                Tier1: { Min: 6, Max: 12 },
                Tier2: { Min: 16.6, Max: 21 },
                Tier3: { Min: 21.6, Max: 30 },
                Tier4: { Min: 30.6, Max: 42 },
                Tier5: { Min: 42.6, Max: 60 },
                Max: 300,
                FutureMax: 230,
            },
        },
        {
            name: "Health regeneration",
            tiers: {
                Tier1: { Min: 7, Max: 14 },
                Tier2: { Min: 14.7, Max: 24.5 },
                Tier3: { Min: 25.2, Max: 35 },
                Tier4: { Min: 35.7, Max: 49 },
                Tier5: { Min: 49.71, Max: 70 },
                Max: 350,
                FutureMax: 269,
            },
        },
        {
            name: "KI regeneration",
            tiers: {
                Tier1: { Min: 3, Max: 6 },
                Tier2: { Min: 6.3, Max: 10.5 },
                Tier3: { Min: 10.8, Max: 15 },
                Tier4: { Min: 15.3, Max: 21 },
                Tier5: { Min: 21.3, Max: 30 },
                Max: 150,
                FutureMax: 115,
            },
        },
        {
            name: "DMG",
            tiers: {
                Tier1: { Min: 10, Max: 20 },
                Tier2: { Min: 21, Max: 35 },
                Tier3: { Min: 36, Max: 50 },
                Tier4: { Min: 51, Max: 70 },
                Tier5: { Min: 71, Max: 100 },
                Max: 500,
                FutureMax: 384,
            },
        },
        {
            name: "Health (%)",
            tiers: {
                Tier1: { Min: 0.4, Max: 0.8 },
                Tier2: { Min: 0.8, Max: 1.4 },
                Tier3: { Min: 1.44, Max: 2 },
                Tier4: { Min: 2.04, Max: 2.8 },
                Tier5: { Min: 2.84, Max: 4 },
                Max: 20,
                FutureMax: 15.38,
            },
        },
        {
            name: "KI (%)",
            tiers: {
                Tier1: { Min: 0.4, Max: 0.8 },
                Tier2: { Min: 0.8, Max: 1.4 },
                Tier3: { Min: 1.44, Max: 2 },
                Tier4: { Min: 2.04, Max: 2.8 },
                Tier5: { Min: 2.84, Max: 4 },
                Max: 20,
                FutureMax: 15.38,
            },
        },
        {
            name: "Life Drain (%)",
            tiers: {
                Tier1: { Min: 0.5, Max: 1 },
                Tier2: { Min: 1.05, Max: 1.75 },
                Tier3: { Min: 1.8, Max: 2.5 },
                Tier4: { Min: 2.55, Max: 3.5 },
                Tier5: { Min: 3.55, Max: 5 },
                Max: 25,
                FutureMax: 19.23,
            },
        },
        {
            name: "Ki Drain (%)",
            tiers: {
                Tier1: { Min: 0.5, Max: 1 },
                Tier2: { Min: 1.05, Max: 1.75 },
                Tier3: { Min: 1.8, Max: 2.5 },
                Tier4: { Min: 2.55, Max: 3.5 },
                Tier5: { Min: 3.55, Max: 5 },
                Max: 25,
                FutureMax: 19.23,
            },
        },
        {
            name: "Heal effectiveness (%)",
            tiers: {
                Tier1: { Min: 1.1, Max: 2.2 },
                Tier2: { Min: 2.31, Max: 3.85 },
                Tier3: { Min: 3.96, Max: 5.5 },
                Tier4: { Min: 5.61, Max: 7.7 },
                Tier5: { Min: 7.81, Max: 11 },
                Max: 55,
                FutureMax: 42.3,
            },
        },
        {
            name: "Health regeneration (%)",
            tiers: {
                Tier1: { Min: 0.3, Max: 0.6 },
                Tier2: { Min: 0.63, Max: 1.05 },
                Tier3: { Min: 1.08, Max: 1.5 },
                Tier4: { Min: 1.53, Max: 2.1 },
                Tier5: { Min: 2.13, Max: 3 },
                Max: 15,
                FutureMax: 11.53,
            },
        },
        {
            name: "KI regeneration (%)",
            tiers: {
                Tier1: { Min: 0.1, Max: 0.2 },
                Tier2: { Min: 0.21, Max: 0.35 },
                Tier3: { Min: 0.36, Max: 0.5 },
                Tier4: { Min: 0.51, Max: 0.7 },
                Tier5: { Min: 0.71, Max: 1 },
                Max: 5,
                FutureMax: 3.84,
            },
        },
        {
            name: "Movement Speed (%)",
            tiers: {
                Tier1: { Min: 0.8, Max: 1.6 },
                Tier2: { Min: 1.68, Max: 2.8 },
                Tier3: { Min: 2.88, Max: 4 },
                Tier4: { Min: 4.08, Max: 5.6 },
                Tier5: { Min: 5.68, Max: 8 },
                Max: 40,
                FutureMax: 30.76,
            },
        },
        {
            name: "Attack Speed (%)",
            tiers: {
                Tier1: { Min: 0.8, Max: 1.6 },
                Tier2: { Min: 1.68, Max: 2.8 },
                Tier3: { Min: 2.88, Max: 4 },
                Tier4: { Min: 4.08, Max: 5.6 },
                Tier5: { Min: 5.68, Max: 8 },
                Max: 40,
                FutureMax: 30.76,
            },
        },
        {
            name: "CD reduction (%)",
            tiers: {
                Tier1: { Min: 0.8, Max: 1.6 },
                Tier2: { Min: 1.68, Max: 2.8 },
                Tier3: { Min: 2.88, Max: 4 },
                Tier4: { Min: 4.08, Max: 5.6 },
                Tier5: { Min: 5.68, Max: 8 },
                Max: 40,
                FutureMax: 30.76,
            },
        },
        {
            name: "Ki Reduction (%)",
            tiers: {
                Tier1: { Min: 1, Max: 2 },
                Tier2: { Min: 2.1, Max: 3.5 },
                Tier3: { Min: 3.6, Max: 5 },
                Tier4: { Min: 5.1, Max: 7 },
                Tier5: { Min: 7.1, Max: 10 },
                Max: 40,
                FutureMax: 30.76,
            },
        },
        {
            name: "DMG Reflect (%)",
            tiers: {
                Tier1: { Min: 1, Max: 2 },
                Tier2: { Min: 2.1, Max: 3.5 },
                Tier3: { Min: 3.6, Max: 5 },
                Tier4: { Min: 5.1, Max: 7 },
                Tier5: { Min: 7.1, Max: 10 },
                Max: 50,
                FutureMax: 38.46,
            },
        },
        {
            name: "DMG Reduction (%)",
            tiers: {
                Tier1: { Min: 0.5, Max: 1 },
                Tier2: { Min: 1.05, Max: 1.75 },
                Tier3: { Min: 1.8, Max: 2.5 },
                Tier4: { Min: 2.55, Max: 3.5 },
                Tier5: { Min: 3.55, Max: 5 },
                Max: 25,
                FutureMax: 19.23,
            },
        },
        {
            name: "Dodge chance (%)",
            tiers: {
                Tier1: { Min: 0.5, Max: 1 },
                Tier2: { Min: 1.05, Max: 1.75 },
                Tier3: { Min: 1.8, Max: 2.5 },
                Tier4: { Min: 2.55, Max: 3.5 },
                Tier5: { Min: 3.55, Max: 5 },
                Max: 25,
                FutureMax: 19.23,
            },
        },
        {
            name: "DMG (%)",
            tiers: {
                Tier1: { Min: 0.6, Max: 1.2 },
                Tier2: { Min: 1.26, Max: 2.1 },
                Tier3: { Min: 2.16, Max: 3 },
                Tier4: { Min: 3.06, Max: 4.2 },
                Tier5: { Min: 4.26, Max: 6 },
                Max: 30,
                FutureMax: 23.07,
            },
        },
        {
            name: "Critical chance (%)",
            tiers: {
                Tier1: { Min: 0.4, Max: 0.8 },
                Tier2: { Min: 0.84, Max: 1.4 },
                Tier3: { Min: 1.44, Max: 2 },
                Tier4: { Min: 2.04, Max: 2.8 },
                Tier5: { Min: 2.84, Max: 4 },
                Max: 20,
                FutureMax: 15.38,
            },
        },
        {
            name: "Tenacity (%)",
            tiers: {
                Tier1: { Min: 2, Max: 4 },
                Tier2: { Min: 4.2, Max: 7 },
                Tier3: { Min: 7.2, Max: 10 },
                Tier4: { Min: 10.2, Max: 14 },
                Tier5: { Min: 14.2, Max: 20 },
                Max: 70,
                FutureMax: 53.84,
            },
        },
        {
            name: "Less/More DMG (%)",
            tiers: {
                Tier1: { Min: 3, Max: 6 },
                Tier2: { Min: 6.3, Max: 10.5 },
                Tier3: { Min: 10.8, Max: 15 },
                Tier4: { Min: 15.3, Max: 21 },
                Tier5: { Min: 21.3, Max: 30 },
                Max: 30,
                FutureMax: 23.07,
            },
        },
    ];
};

const convertBonus = (
    tier,
    currentStatusName,
    statusNameToConvert,
    bonusValue
) => {
    // Array de dados
    const data = tiers();

    // Encontrar o status atual
    const currentStatus = data.find((item) => item.name === currentStatusName);
    const maxValueCurrent = currentStatus.tiers[`${tier}`].Max;

    // Encontrar o status de destino
    const targetStatus = data.find((item) => item.name === statusNameToConvert);
    const maxValueNew = targetStatus.tiers[`${tier}`].Max;

    // Calcula o percentual do bônus atual em relação ao valor máximo atual
    const percentage = (bonusValue / maxValueCurrent) * 100;

    // Calcula o novo valor do bônus com base no percentual e no novo valor máximo
    const newBonusValue = (percentage / 100) * maxValueNew;

    // Cria o embed de resposta
    const embed = new EmbedBuilder()
        .setColor("#0099ff") 
        .setTitle("Bonus Conversion") 
        .addFields(
            { name: "Tier", value: `**${tier.replace(/[^0-9]/g, "")}**`, inline: true },
            {
                name: "Current Status",
                value: `**${currentStatusName}**`,
                inline: true,
            },
            {
                name: "Target Status",
                value: `**${statusNameToConvert}**`,
                inline: true,
            },
            {
                name: "Current Bonus Value",
                value: `**${bonusValue}**`,
                inline: true,
            },
            {
                name: "Current Maximum",
                value: `**${maxValueCurrent}**`,
                inline: true,
            },
            {
                name: "Target Maximum",
                value: `**${maxValueNew}**`,
                inline: true,
            },
            {
                name: "Current Bonus Percentage",
                value: `**${percentage.toFixed(2)}%**`,
                inline: false,
            },
            {
                name: "New Bonus Value",
                value: `**${newBonusValue.toFixed(2)}**`,
                inline: false,
            }
        );

    return embed;
};

const convertAllBonus = (bonusArray, statusNamesToConvert) => {
    const data = tiers(); // Função que retorna os dados dos tiers

    const embed1 = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Bonus Details");

    const embed2 = new EmbedBuilder()
        .setColor("#ff9900")
        .setTitle("Bonus Conversion");

    bonusArray.forEach(({ bonus, value, tier, proportion }) => {
        const currentStatus = data.find(item => item.name === bonus);
        if (!currentStatus) throw new Error("Current status not found");

        const maxValueCurrent = currentStatus.tiers[tier].Max;
        const percentage = parseFloat(proportion);

        embed1.addFields({
            name: bonus,
            value: `Tier **${tier.replace(/[^0-9]/g, "")}** | Value **${value}** | Max **${maxValueCurrent}** | ${percentage.toFixed(2)}%`,
            inline: false
        });

        let conversionText = "";

        statusNamesToConvert.forEach(statusNameToConvert => {
            const targetStatus = data.find(item => item.name === statusNameToConvert);
            if (!targetStatus) return;

            const maxValueNew = targetStatus.tiers[tier].Max;
            const newBonusValue = (percentage / 100) * maxValueNew;

            conversionText += `**${statusNameToConvert}** → Max **${maxValueNew}**, New Bonus **${newBonusValue.toFixed(2)}**\n`;
        });

        if (conversionText) {
            embed2.addFields({ name: bonus, value: conversionText, inline: false });
        }
    });

    return [embed1, embed2];
};


const getStatusInfoEmbed = (statusName) => {
    // Dados
    const data = tiers()

    // Localizar o status pelo nome
    const status = data.find(item => item.name === statusName);

    // Caso o status não seja encontrado
    if (!status) {
        return new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("Status Not Found")
            .setDescription(`The status **${statusName}** does not exist.`)
            .setTimestamp();
    }

    // Criação do embed com as informações do status
    const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Status Information: ${status.name}`)
        .setDescription("Here are the details for the requested status:")
        .addFields(
            { name: "Tier 1", value: `Min: ${status.tiers['Tier1'].Min}, Max: ${status.tiers['Tier1'].Max}`, inline: false },
            { name: "Tier 2", value: `Min: ${status.tiers['Tier2'].Min}, Max: ${status.tiers['Tier2'].Max}`, inline: false },
            { name: "Tier 3", value: `Min: ${status.tiers['Tier3'].Min}, Max: ${status.tiers['Tier3'].Max}`, inline: false },
            { name: "Tier 4", value: `Min: ${status.tiers['Tier4'].Min}, Max: ${status.tiers['Tier4'].Max}`, inline: false },
            { name: "Tier 5", value: `Min: ${status.tiers['Tier5'].Min}, Max: ${status.tiers['Tier5'].Max}`, inline: false },
            { name: "Max Value", value: `${status.tiers.Max}`, inline: true },
            { name: "Future Max Value", value: `${status.tiers.FutureMax}`, inline: true }
        )

    return embed;
};

module.exports = {
    tiers,
    convertBonus,
    getStatusInfoEmbed,
    convertAllBonus
};
