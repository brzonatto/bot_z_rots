const db = require("./data/db");
const rotsApi = require("./data/rotsApi");
const djs = require("discord.js");

const getKillerPlayer = async (nickname) => {   
    const response = await rotsApi.findByName(nickname);
    const playerID = Array.isArray(response)
        ? response[0]
        : null;
        
    return playerID.id
};

const compareNames = async () => {
    const localPlayers = await db.findAll();
    const differences = [];

    for (const localPlayer of localPlayers) {
        // Inicializa old_names como um array vazio caso não exista
        const oldNames = localPlayer.old_names || [];

        if (localPlayer.name !== oldNames[0]) {
            differences.push({
                currentName: localPlayer.name,
                oldName: oldNames[0],
            });
            
            const updatedOldNames = [localPlayer.name, ...oldNames];

            await db.update(
                { id: localPlayer.id },
                { old_names: updatedOldNames }
            );            
        }
    }

    return differences;
};

const compareVocations = async () => {
    const localPlayers = await db.findAll();
    const differences = [];

    for (const localPlayer of localPlayers) {
        // Inicializa lastVocation como um array vazio caso não exista
        const lastVocation = localPlayer.last_vocation || null;

        if (localPlayer.vocation.name !== lastVocation?.vocationName) {
            differences.push({
                name: localPlayer.name,
                currentVocationName: localPlayer.vocation.name,
                changedVocationName: lastVocation?.vocationName,
                currentLevel: localPlayer.level,
                changedLevel: lastVocation?.level,
            });

            const updatedLastVocation = {
                vocationName: localPlayer.vocation.name,
                level: localPlayer.level,
            };

            await db.update(
                { id: localPlayer.id },
                { last_vocation: updatedLastVocation }
            );            
        }
    }

    return differences;
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
                memberID: localPlayer.memberID || null,
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
    compareNames,
    compareVocations
};
