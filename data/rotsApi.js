const db = require("../data/db");
const pLimit = require("p-limit");
const got = require("got").default;

const API_URL = "https://api.saiyansreturn.com";
const SERVER_NAME = "Universe Beerus";
const HEADERS = {
    "User-Agent": "PostmanRuntime/7.43.2",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
};

// 🔍 Busca jogador pelo nome
const findByName = async (nickName) => {
    try {
        return await got(`${API_URL}/characters`, {
            searchParams: { server: SERVER_NAME, name: nickName, limit: 1 },
            headers: HEADERS,
            responseType: "json"
        }).json();
    } catch (error) {
        console.error(`Erro ao buscar jogador por nome (${nickName}):`, error.message);
        return null;
    }
};

// 🔍 Busca jogador pelo ID
const findPlayerByID = async (playerID) => {
    try {
        return await got(`${API_URL}/profile/${playerID}`, {
            searchParams: { server: SERVER_NAME },
            headers: HEADERS,
            responseType: "json"
        }).json();
    } catch (error) {
        console.error(`Erro ao buscar jogador por ID (${playerID}):`, error.message);
        return null;
    }
};

// 🔄 Busca todos os jogadores em paralelo (com limite)
const findAllPlayersParallel = async () => {
    const allPlayersInDB = await db.findAll(); // Busca todos os jogadores no banco
    const limit = pLimit(10); // Limita a 5 requisições simultâneas
    let countError = 0;
    let countAccepted = 0;

    const promises = allPlayersInDB.map(player =>
        limit(async () => {
            try {
                const updatedPlayer = await got(`${API_URL}/profile/${player.id}`, {
                    searchParams: { server: SERVER_NAME },
                    headers: HEADERS,
                    responseType: "json"
                }).json();

                countAccepted++;
                return { id: player.id, ...updatedPlayer };
            } catch (error) {
                countError++;
                console.error(`Erro ao buscar dados para ID ${player.id}:`, error.message);
                return null;
            }
        })
    );

    const updatedPlayers = (await Promise.all(promises)).filter(player => player !== null);
    
    console.log(`Get API accepted: ${countAccepted}/${allPlayersInDB.length}`);
    console.log(`Get API error: ${countError}/${allPlayersInDB.length}`);
    
    return updatedPlayers;
};

// 🔄 Busca todos os jogadores (um por um)
const findAllPlayers = async () => {
    const allPlayersInDB = await db.findAll();
    const updatedPlayers = [];

    for (const player of allPlayersInDB) {
        try {
            const updatedPlayer = await got(`${API_URL}/profile/${player.id}`, {
                searchParams: { server: SERVER_NAME },
                headers: HEADERS,
                responseType: "json"
            }).json();

            if (updatedPlayer) {
                updatedPlayers.push({ id: player.id, ...updatedPlayer });
            }
        } catch (error) {
            console.error(`Erro ao buscar dados para ID ${player.id}:`, error.message);
        }
    }

    return updatedPlayers;
};

module.exports = {
    findByName,
    findPlayerByID,
    findAllPlayers,
    findAllPlayersParallel
};
