const db = require("./data/db");
const rotsApi = require("./data/rotsApi");

const compareDeaths = async () => {
    const localPlayers = await db.findAll(); // Busca todos os jogadores da base local
    const differences = []; // Array para armazenar as diferenças
    let count = 0;

    for (const localPlayer of localPlayers) {
        const rotsPlayer = await rotsApi.findPlayerByID(localPlayer.id); // Busca o jogador na API
        console.log("name", localPlayer.name);
        console.log("localPlayer", localPlayer.deaths?.deaths?.[0]?.time);
        console.log("rotsPlayer", rotsPlayer.deaths?.deaths?.[0]?.time);
        console.log(
            "###########################################################"
        );

        let playerKilledBy = null;
        let playerMostDamageBy = null;

        if (rotsPlayer.deaths?.deaths?.[0]?.is_player === 1) {
            const killedByResponse = await rotsApi.findIDPlayer(
                rotsPlayer.deaths.deaths[0].killed_by
            );
            playerKilledBy = Array.isArray(killedByResponse)
                ? killedByResponse[0]
                : null;
        }

        if (rotsPlayer.deaths?.deaths?.[0]?.mostdamage_is_player === 1) {
            const mostDamageByResponse = await rotsApi.findIDPlayer(
                rotsPlayer.deaths.deaths[0].mostdamage_by
            );
            playerMostDamageBy = Array.isArray(mostDamageByResponse)
                ? mostDamageByResponse[0]
                : null;
        }

        if (
            localPlayer.deaths?.deaths?.[0]?.time !==
            rotsPlayer.deaths?.deaths?.[0]?.time
        ) {
            differences.push({
                id: localPlayer.id,
                name: localPlayer.name,
                playerKilledByID: playerKilledBy?.id || null,
                playerMostDamageByID: playerMostDamageBy?.id || null,
                pvp_type: localPlayer.pvp_type,
                death: rotsPlayer.deaths?.deaths?.[0] || null,
            });
        }

        count++;
        console.log(`${count}/${localPlayers.length}`);
    }

    return differences; // Retorna o array com as diferenças
};

module.exports = {
    compareDeaths,
};
