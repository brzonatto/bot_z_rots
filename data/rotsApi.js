const db = require("../data/db");
const pLimit = require('p-limit');

const findByName = async (nickName) => {
    let player
    await fetch(`https://api.saiyansreturn.com/characters?server=Universe%20Beerus&name=${nickName}&limit=1`)
            .then(response => response.json())    
            .then(data => {
                player = data
            })
            .catch(error => console.error(error))
            
            return player
}

       
const findPlayerByID = async (playerID) => {
    let player
    await fetch(`https://api.saiyansreturn.com/profile/${playerID}?server=Universe%20Beerus`)
        .then(response => response.json())
        .then(data => {
            player = data
        })
        .catch(error => console.error(error))

        return player
}

const findAllPlayersParallel = async () => {
    const allPlayersInDB = await db.findAll(); // Busca todos os jogadores no banco de dados
    const limit = pLimit(15); // Limita a 20 requisições simultâneas

    const promises = allPlayersInDB.map(player =>
        limit(async () => {
            try {
                const response = await fetch(`https://api.saiyansreturn.com/profile/${player.id}?server=Universe%20Beerus`);
                const updatedPlayer = await response.json();
                return { id: player.id, ...updatedPlayer };
            } catch (error) {
                console.error(`Erro ao buscar dados para o ID ${player.id}:`, error);
                return null; // Retorna null em caso de erro
            }
        })
    );

    const updatedPlayers = (await Promise.all(promises)).filter(player => player !== null);
    return updatedPlayers; // Retorna a lista com os jogadores atualizados
};

const findAllPlayers = async () => {
    const allPlayersInDB = await db.findAll(); // Busca todos os jogadores no banco de dados
    const updatedPlayers = []; // Lista para armazenar os jogadores atualizados
    // let count = 1

    for (const player of allPlayersInDB) {
        try {
            // Busca os dados atualizados do jogador na API
            const updatedPlayer = await fetch(`https://api.saiyansreturn.com/profile/${player.id}?server=Universe%20Beerus`)
                .then(response => response.json())
                .catch(error => {
                    console.error(`Erro ao buscar dados para o ID ${player.id}:`, error);
                    return null; // Retorna null se houver erro
                });

            if (updatedPlayer) {
                // Adiciona os dados atualizados à lista
                updatedPlayers.push({ id: player.id, ...updatedPlayer });
                // console.log(`Get rotsApi: ${count}/${allPlayersInDB.length}`)
                // count++
            }
        } catch (error) {
            console.error(`Erro ao processar o jogador ${player.id}:`, error);
        }
    }

    return updatedPlayers; // Retorna a lista com os jogadores atualizados
};


module.exports = {
    findByName,
    findPlayerByID,
    findAllPlayers,
    findAllPlayersParallel  
}
