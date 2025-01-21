const { EmbedBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

const setClass = (vocation) => {
    switch (vocation) {
        case "Goku":
            return "Half";
        case "Vegeta":
            return "Half";
        case "Buu":
            return "Tank";
        case "Piccolo":
            return "Tank";
        case "Gohan":
            return "Damage";
        case "Trunks":
            return "Damage";
        case "Dende":
            return "Suporte";
        case "Bulma":
            return "Suporte";
    }
};

const setTumb = (vocation) => {
    switch (vocation) {
        case "Goku":
            return "https://saiyansreturn.com/images/characters/Goku/avatar.png";
        case "Vegeta":
            return "https://saiyansreturn.com/images/characters/Vegeta/avatar.png";
        case "Buu":
            return "https://saiyansreturn.com/images/characters/Buu/avatar.png";
        case "Piccolo":
            return "https://saiyansreturn.com/images/characters/Piccolo/avatar.png";
        case "Gohan":
            return "https://saiyansreturn.com/images/characters/Gohan/avatar.png";
        case "Trunks":
            return "https://saiyansreturn.com/images/characters/Trunks/avatar.png";
        case "Dende":
            return "https://saiyansreturn.com/images/characters/Dende/avatar.png";
        case "Bulma":
            return "https://saiyansreturn.com/images/characters/Bulma/avatar.png";
    }
};

const convertTimestamp = (timestamp) => {
    // Multiplica por 1000 para converter de segundos para milissegundos
    const date = new Date(timestamp * 1000);

    // Extrai partes da data
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
    const year = date.getFullYear();

    // Extrai partes do horário
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Retorna a data formatada como string
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const convertTimestampToDate = (timestamp) => {
    // Multiplica por 1000 para converter de segundos para milissegundos
    return new Date(timestamp * 1000);
};

const makeLevelUpCard = (character) => {
    if (character.log_type == "newDeath") {
        const card = new EmbedBuilder()
            .setColor(setPvpColor(character.pvp_type))
            .setTitle(`${character.name} - ${character.level}`)
            .setURL(
                `https://saiyansreturn.com/profile/${character.id}?server=Universe%20Beerus`
            )
            .setDescription(
                `${setClass(character.vocation.name)} - ${character.vocation.name}`
            )
            .setThumbnail(setTumb(character.vocation.name))
            .addFields({
                name: "Died now",
                value: `${convertTimestamp(character.deaths.deaths[0].time)} 
                                                by ${character.deaths.deaths[0]
                        .killed_by
                    } 
                                                    ${character.deaths.deaths[0]
                        .killed_by !=
                        character.deaths.deaths[0]
                            .mostdamage_by
                        ? "and " +
                        character.deaths
                            .deaths[0]
                            .mostdamage_by
                        : ""
                    }`,
            });
        return card;
    } else {
        const card = new EmbedBuilder()
            .setColor(setPvpColor(character.pvp_type))
            .setTitle(`${character.name}`)
            .setURL(
                `https://saiyansreturn.com/profile/${character.id}?server=Universe%20Beerus`
            )
            .setDescription(
                `${setClass(character.vocation.name)} - ${character.vocation.name}`
            )
            .setThumbnail(setTumb(character.vocation.name))
            .addFields(
                { name: "\u200B", value: "\u200B" },
                {
                    name: "Level UP!",
                    value: `${character.former_level} > ${character.level}`,
                }
            );

        return card;
    }
};

const setPvpColor = (pvpType) => {
    switch (pvpType) {
        case "player":
            return 0x77c479;
        case "Enemy":
            return 0xee5e52;
        default:
            return 0x66b7f1;
    }
};

const calcWarStatistics = async (
    playersOne,
    playersTwo,
    startTime,
    endTime,
    enemyGuild = null
) => {
    // ally
    const playersTwoNames = playersTwo.map((player) => player.name);
    const playersOneNames = playersOne.map((player) => player.name);

    // enemy
    const updatedPlayersOne = playersOne.map((player) => ({
        ...player,
        deaths: {
            ...player.deaths,
            deaths:
                player.deaths?.deaths
                    .filter((death) => {
                        const deathTime = new Date(death.time);
                        const isPlayerDeath =
                            death.is_player === 1 || death.mostdamage_is_player === 1;
                        const isWithinTimeRange =
                            deathTime >= startTime && deathTime <= endTime;

                        return isPlayerDeath && isWithinTimeRange;
                    })
                    .map((death) => ({
                        ...death,
                        time: convertTimestampToDate(death.time),
                    })) || [],
        },
    }));

    //ally
    const updatedPlayersTwo = playersTwo.map((player) => ({
        ...player,
        deaths: {
            ...player.deaths,
            deaths:
                player.deaths?.deaths
                    .filter((death) => {
                        const deathTime = new Date(death.time).getTime();
                        const isPlayerDeath =
                            death.is_player === 1 || death.mostdamage_is_player === 1;
                        const isWithinTimeRange =
                            deathTime >= startTime && deathTime <= endTime;

                        return isPlayerDeath && isWithinTimeRange;
                    })
                    .map((death) => ({
                        ...death,
                        time: convertTimestampToDate(death.time),
                    })) || [],
        },
    }));
    
    const killStats = playersTwoNames.reduce((acc, player) => {
        acc[player] = { kills: 0, mostDamage: 0, fullKills: 0, deaths: 0, KDA: 0 };
        return acc;
    }, {});
    

    updatedPlayersTwo.forEach((player) => {
        
        const relevantDeaths = player.deaths?.deaths.filter(
            (death) => playersOneNames.includes(death.killed_by) || playersOneNames.includes(death.mostdamage_by)
        );

        killStats[player.name].deaths = relevantDeaths ? relevantDeaths.length : 0;
    });

    updatedPlayersOne.forEach((player) => {
        player.deaths?.deaths.forEach((death) => {
            if (playersTwoNames.includes(death.killed_by)) {
                killStats[death.killed_by].kills += 1;
            }

            if (playersTwoNames.includes(death.mostdamage_by)) {
                killStats[death.mostdamage_by].mostDamage += 1;
            }

            if (
                death.killed_by === death.mostdamage_by &&
                playersTwoNames.includes(death.mostdamage_by)
            ) {
                killStats[death.killed_by].fullKills += 1;
            }
        });
    });

    Object.keys(killStats).forEach((player) => {
        const stats = killStats[player];
        stats.KDA =
            stats.deaths > 0
                ? ((stats.kills + stats.mostDamage) / stats.deaths).toFixed(2)
                : (stats.kills + stats.mostDamage).toFixed(2);

        stats.KDA = parseFloat(stats.KDA);
    });

    const filteredKillStats = Object.entries(killStats)
        .filter(([player, stats]) => {
            return (
                stats.kills > 0 ||
                stats.mostDamage > 0 ||
                stats.fullKills > 0 ||
                stats.deaths > 0 ||
                stats.KDA > 0
            );
        })
        .map(([player, stats]) => ({
            name: player, // Coloca o nome do jogador aqui
            kills: stats.kills,
            mostDamage: stats.mostDamage,
            fullKills: stats.fullKills,
            deaths: stats.deaths,
            KDA: stats.KDA,
        }));

    const sortedKillStats = Object.fromEntries(
        Object.entries(filteredKillStats).sort(
            ([, statsA], [, statsB]) => statsB.KDA - statsA.KDA
        )
    );

    let resultArray = [];

    for (let index = 0; index < Object.keys(sortedKillStats).length; index++) {
        resultArray.push(sortedKillStats[index]);
    }

    const sortedData = resultArray.sort((a, b) => b.KDA - a.KDA);

    return sortedData;
};

const convertToTimestamp = async (dateString) => {
    const [day, month, year, hour = "00", minute = "00"] =
        dateString.split(/[\/\s:]/);
    const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:00`;

    const timestamp = new Date(formattedDate).getTime();
    return Math.floor(timestamp / 1000);
};

const generateTableImage = async (data) => {
    const canvasWidth = 1000; // Ajustado para acomodar a nova coluna
    const canvasHeight = data.length * 50 + 50; // Ajusta a altura com base nas linhas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Estilo geral
    ctx.fillStyle = "#36393f";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Cabeçalho
    ctx.fillStyle = "#2f3136";
    ctx.fillRect(0, 0, canvasWidth, 50);

    const headerMargin = canvasWidth / 7; // Ajuste para distribuir melhor as colunas (incluindo a nova)

    // Títulos das colunas
    ctx.fillStyle = "#ffffff";
    ctx.fillText("#", headerMargin * 0.5, 25); // Nova coluna para a colocação
    ctx.fillText("Name", headerMargin * 1.5, 25);
    ctx.fillText("Kills", headerMargin * 2.5, 25);
    ctx.fillText("Most Damage", headerMargin * 3.5, 25);
    ctx.fillText("Full Kills", headerMargin * 4.5, 25);
    ctx.fillText("Deaths", headerMargin * 5.5, 25);
    ctx.fillText("KDA", headerMargin * 6.5, 25);

    // Linhas da tabela
    data.forEach((row, index) => {
        const y = 50 + index * 50;
        ctx.fillStyle = index % 2 === 0 ? "#36393f" : "#2f3136";
        ctx.fillRect(0, y, canvasWidth, 50);

        ctx.fillStyle = "#ffffff"; // Cor da fonte dos dados
        ctx.fillText(index + 1, headerMargin * 0.5, y + 25); // Colocação
        ctx.fillText(row.name, headerMargin * 1.5, y + 25);
        ctx.fillText(row.kills, headerMargin * 2.5, y + 25);
        ctx.fillText(row.mostDamage, headerMargin * 3.5, y + 25);
        ctx.fillText(row.fullKills, headerMargin * 4.5, y + 25);
        ctx.fillText(row.deaths, headerMargin * 5.5, y + 25);
        ctx.fillText(row.KDA, headerMargin * 6.5, y + 25);
    });

    return canvas.toBuffer();
};

const countTotalDeathsBy = async (data, players) => {
    const names = players.map((ally) => ally.name);
    return data.reduce((totalDeaths, player) => {
        console.log(player)
        const wasKilledBy = names.includes(player.killed_by) || names.includes(player.mostdamage_by);
        return totalDeaths + (wasKilledBy ? 1 : 0);
    }, 0);
};

const countTotalDeaths = async (data) => {
    return data.reduce((totalDeaths, player) => totalDeaths + player.deaths, 0);
};

const loadImageFromFolder = async (folderPath, fileName) => {
    // Combina o caminho da pasta com o nome do arquivo
    const filePath = path.join(folderPath, fileName);

    // Carrega a imagem
    const image = await loadImage(filePath);
    return image;
};

const mergeImagesWithStats = async (imageBuffer1, imageBuffer2, stats) => {
    // Carregar as imagens a partir dos buffers
    const img1 = await loadImage(imageBuffer1);
    const img2 = await loadImage(imageBuffer2);

    // Determinar dimensões
    const totalWidth = img1.width + img2.width;
    const lineHeight = 80; // Altura de cada linha das estatísticas
    const statsHeight = lineHeight * stats.length; // Espaço para todas as estatísticas
    const maxHeight = Math.max(img1.height, img2.height) + statsHeight;

    // Criar um novo canvas
    const canvas = createCanvas(totalWidth, maxHeight);
    const ctx = canvas.getContext("2d");

    // Preencher o fundo de branco
    ctx.fillStyle = "#36393f";
    ctx.fillRect(0, 0, totalWidth, maxHeight);

    // Estilo do texto das estatísticas
    ctx.fillStyle = "#000000";
    ctx.font = "42px Arial"; // Aumentou a fonte
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const backgroundImage = await loadImageFromFolder(
        "./images",
        "background.png"
    );

    // Desenhar estatísticas no topo com espaçamento ajustado
    const centerX = totalWidth / 2;

    ctx.drawImage(backgroundImage, 0, 0);
    stats.forEach((stat, index) => {
        const statY = lineHeight * (index + 0.5); // Calcula a posição de cada linha
        ctx.fillText(stat, centerX, statY);
    });

    // Desenhar as tabelas abaixo das estatísticas
    ctx.drawImage(img1, 0, statsHeight);
    ctx.drawImage(img2, img1.width, statsHeight);

    // Adicionar um separador entre as tabelas
    const separatorX = img1.width; // Linha no final da primeira tabela
    ctx.strokeStyle = "#ffffff"; // Cor da linha
    ctx.lineWidth = 2; // Espessura da linha
    ctx.beginPath();
    ctx.moveTo(separatorX, statsHeight); // Começa a linha abaixo das estatísticas
    ctx.lineTo(separatorX, maxHeight); // Linha até o final do canvas
    ctx.stroke();

    // Retornar o buffer da imagem combinada
    return canvas.toBuffer();
};

module.exports = {
    setClass,
    setTumb,
    convertTimestamp,
    setPvpColor,
    makeLevelUpCard,
    convertTimestampToDate,
    convertToTimestamp,
    calcWarStatistics,
    generateTableImage,
    countTotalDeaths,
    mergeImagesWithStats,
    countTotalDeathsBy
};
