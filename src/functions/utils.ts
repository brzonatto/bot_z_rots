import { config } from "..";

export const SetClass = (vocation: string) => {
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

export const SetTumb = (vocation: string) => {
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
        default:
            return "https://saiyansreturn.com/images/characters/Bulma/avatar.png";
    }
};

export const SetPvpColor = (pvpType: string) => {
    switch (pvpType) {
        case "Ally":
            return 0x34bf36;
        case "Enemy":
            return 0xeb3434;
        default:
            return 0x347cbf;
    }
};

export const ConvertTimestamp = (timestamp: number) => {
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