import { Character, Vocation } from "../models/Character";

export interface Skills {
    agility: number;
    attackSpeed: number;
    defense: number;
    fishing: number;
    fist: number;
    focus: number;
    movementSpeed: number;
    weapon: number;
}

export interface Death {
    isPlayer: number;
    killedBy: string;
    level: number;
    mostdamageBy: string;
    mostdamageIsPlayer: number;
    time: number;
}

export interface CharacterMap {
    id: number;
    name: string;
    level: number;
    lastLogin: number;
    onlineTime: number;
    vocation: Vocation;
    skills: Skills;
    trainingStamina: number;
    deaths: Death[];
    expBoost: number;
}

export const characterMap = (character: Character): CharacterMap => ({
    id: character.id,
    name: character.name,
    level: character.level,
    lastLogin: character.last_login,
    onlineTime: character.online_time,
    vocation: character.vocation,
    skills: {
        agility: character.skills.agility.level,
        attackSpeed: character.skills.attack_speed.level,
        defense: character.skills.defense.level,
        fishing: character.skills.fishing.level,
        fist: character.skills.fist.level,
        focus: character.skills.focus.level,
        movementSpeed: character.skills.movement_speed.level,
        weapon: character.skills.weapon.level
    },
    trainingStamina: character.training_stamina,
    deaths: character.deaths.deaths.map(death => ({
        isPlayer: death.is_player,
        killedBy: death.killed_by,
        level: death.level,
        mostdamageBy: death.mostdamage_by,
        mostdamageIsPlayer: death.mostdamage_is_player,
        time: death.time
    })),
    expBoost: character.exp_boost
})