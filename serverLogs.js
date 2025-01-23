const db = require("./data/db");
const rotsApi = require("./data/rotsApi");

const getKillerPlayer = async (nickname) => {   
    const response = await rotsApi.findByName(nickname);
    const playerID = Array.isArray(response)
        ? response[0]
        : null;
        
    return playerID.id
};

const compareDeaths = async () => {
    const localPlayers = await db.findAll();
    const differences = [];
    // let count = 1;

    for (const localPlayer of localPlayers) {        
        if (
            !localPlayer.deaths || 
            !Array.isArray(localPlayer.deaths.deaths) || 
            localPlayer.deaths.deaths.length === 0
        ) {
            // console.log(`Skipping player ${localPlayer.name}, no deaths data.`);
            // count++
            continue;
        }

        const lastDeath = localPlayer.last_death || null;
        const currentDeath = localPlayer.deaths.deaths[0];

        // console.log(`Compare death: ${count}/${localPlayers.length}`);
        // console.log("name", localPlayer.name);
        // console.log("lastDeath", lastDeath?.time);
        // console.log("currentDeath", currentDeath?.time);
        // console.log(
        //     "###########################################################"
        // );
        
        if (!lastDeath || lastDeath.time !== currentDeath?.time) {
            differences.push({
                id: localPlayer.id,
                name: localPlayer.name,
                pvp_type: localPlayer.pvp_type,
                death: currentDeath || null,
            });

            await db.update(
                { id: localPlayer.id },
                { last_death: currentDeath }
            );
        }

        // count++;        
    }
    
    return differences;
};

module.exports = {
    compareDeaths,
    getKillerPlayer,
};
