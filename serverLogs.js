const db = require('./data/db')
const rotsApi = require('./data/rotsApi')

// dotenv
const dotenv = require("dotenv");
dotenv.config();
const { CHANNEL_SERVER_LOGS_ID } = process.env;


const compareLevel = async () => {
    const players = await db.findAll()
    let response = []

    for (const player of players) {
        let playerApiRots = await rotsApi.findPlayerByID(player.id)
        let lastLevelSaved = player.level
        let lastLevelApiRots = playerApiRots.level
        let updatedPlayer = player

        if (lastLevelApiRots > lastLevelSaved) {
            updatedPlayer.level = playerApiRots.level
            updatedPlayer.former_level = lastLevelSaved
            updatedPlayer.log_type = 'upLevel'
            response.push(updatedPlayer)
            //console.log(`mudou o level de ${player.name}`)
        }
    }

    return response
}

const compareDeaths = async () => {
    const localPlayers = await db.findAll(); // Busca todos os jogadores da base local
    const differences = []; // Array para armazenar as diferenças
    let count = 0;

    for (const localPlayer of localPlayers) {
        const rotsPlayer = await rotsApi.findPlayerByID(localPlayer.id); // Busca o jogador na API
        console.log('name', localPlayer.name)
        console.log('localPlayer', localPlayer.deaths?.deaths[0]?.time)
        console.log('rotsPlayer', rotsPlayer.deaths?.deaths[0]?.time)
        console.log('###########################################################')

        // throw new Error("pera");


        // Compara a "death" da posição 0
        if (localPlayer.deaths?.deaths[0]?.time !== rotsPlayer.deaths?.deaths[0]?.time) {
            differences.push({
                id: localPlayer.id,
                name: localPlayer.name,
                pvp_type: localPlayer.pvp_type,             // Adiciona o nome do localPlayer
                death: rotsPlayer.deaths?.deaths[0],  // Adiciona a diferença de deaths
            });
        }

        count++;
        console.log(`${count}/${localPlayers.length}`);
    }

    return differences; // Retorna o array com as diferenças
};


// const compareDeath = async () => {
//     const players = await db.findAll()
//     let response = []

//     for (const player of players) {
//         let playerApiRots = await rotsApi.findPlayerByID(player.id)
//         let lastDeathSaved = player.deaths.deaths[0]
//         let lastDeathApiRots = playerApiRots.deaths.deaths[0]
//         let updatedPlayer = player 

//         if (lastDeathSaved.time != lastDeathApiRots.time){
//             updatedPlayer.deaths = playerApiRots.deaths
//             updatedPlayer.log_type = 'newDeath'
//             response.push(updatedPlayer)
//             //console.log(`mudou a morte de ${player.name}`)
//         }  
//     }

//     return response  
// }

module.exports = {
    compareDeaths
}