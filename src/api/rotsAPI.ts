import pLimit from "p-limit";
import dotenv from "dotenv";
import { Character } from "../struct/models/Character";
import { characterMap } from "../struct/mappers/CharacterMap";
dotenv.config()

const MS_DELAY = 8000;
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0 PostmanRuntime/7.43.2",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 5) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, { method: "GET", headers: HEADERS });

            if (response.status === 429) {
                console.warn(`Erro 429 - Tentativa em ${url} ${attempt}/${retries}. Aguardando ${MS_DELAY}ms...`);
                await wait(MS_DELAY);               
                continue;
            }

            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

            if (response.ok && response.status == 200) {
                console.warn(`Accepted ${response.status} - Tentativa em ${url}`);
                return await response.json();
            }
        } catch (error) {
            let errorMsg = "Erro desconhecido";
            if (error instanceof Error) {
                errorMsg = error.message;
            }
            console.error(`Erro na requisição (${url}): ${errorMsg}`);
            if (attempt === retries) return null;
        }
    }
};


export const FindByName = async (nickName: string) => {
    const urlFirstSearch = `${process.env.ROTS_API_URL}/characters?server=${encodeURIComponent("Universe Beerus")}&name=${encodeURIComponent(nickName)}&limit=1`;
    const firstSearch = await fetchWithRetry(urlFirstSearch) as Character[];

    if (!firstSearch) {
        console.error("Erro ao buscar o personagem.".red);
        return;
    }

    if (firstSearch.length === 0) {
        console.error("Personagem não encontrado.".red);
        return;
    }

    const exp_boost: number = firstSearch[0].exp_boost;    

    const urlCharacterSearch = `${process.env.ROTS_API_URL}/profile/${firstSearch[0].id}?server=${encodeURIComponent("Universe Beerus")}`;
    const characterSearch = await fetchWithRetry(urlCharacterSearch) as Character;
    characterSearch.exp_boost = exp_boost;

    return characterMap(characterSearch);    
};