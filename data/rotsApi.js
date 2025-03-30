const db = require("../data/db");
const pLimit = require("p-limit");

const API_URL = "https://api.saiyansreturn.com";
const SERVER_NAME = "Universe Beerus";
const HEADERS = {
    "User-Agent": "PostmanRuntime/7.43.2",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
};

// 🔄 Função para esperar antes de tentar novamente (Exponential Backoff)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🔍 Função que faz a requisição com retry automático
const fetchWithRetry = async (url, retries = 5, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, { method: "GET", headers: HEADERS });

            if (response.status === 429) {
                console.warn(`Erro 429 - Tentativa em ${url} ${attempt}/${retries}. Aguardando ${delay}ms...`);
                await wait(delay);
                delay *= 2; // Aumenta o tempo de espera (exponencial)
                continue;
            }

            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição (${url}): ${error.message}`);
            if (attempt === retries) return null; // Se esgotar as tentativas, retorna null
        }
    }
};

// 🔍 Busca jogador pelo nome
const findByName = async (nickName) => {
    const url = `${API_URL}/characters?server=${encodeURIComponent(SERVER_NAME)}&name=${encodeURIComponent(nickName)}&limit=1`;
    return await fetchWithRetry(url);
};

// 🔍 Busca jogador pelo ID
const findPlayerByID = async (playerID) => {
    const url = `${API_URL}/profile/${playerID}?server=${encodeURIComponent(SERVER_NAME)}`;
    return await fetchWithRetry(url);
};

// 🔄 Busca todos os jogadores em paralelo (com limite)
const findAllPlayersParallel = async () => {
    const allPlayersInDB = await db.findAll();
    const limit = pLimit(3); // Máximo de 3 requisições simultâneas
    let countError = 0;
    let countAccepted = 0;

    const promises = allPlayersInDB.map(player =>
        limit(async () => {
            const url = `${API_URL}/profile/${player.id}?server=${encodeURIComponent(SERVER_NAME)}`;
            const updatedPlayer = await fetchWithRetry(url);

            if (updatedPlayer) {
                countAccepted++;
                return { id: player.id, ...updatedPlayer };
            } else {
                countError++;
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
        const url = `${API_URL}/profile/${player.id}?server=${encodeURIComponent(SERVER_NAME)}`;
        const updatedPlayer = await fetchWithRetry(url);

        if (updatedPlayer) {
            updatedPlayers.push({ id: player.id, ...updatedPlayer });
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
