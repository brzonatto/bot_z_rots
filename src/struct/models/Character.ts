export interface DeathsWrapper {
  deaths: Death[];
  page: number;
  pages: number;
}

export interface Death {
    is_player: number;
    killed_by: string;
    level: number;
    mostdamage_by: string;
    mostdamage_is_player: number;
    mostdamage_unjustified: number;
    time: number;
    unjustified: number;
}

export interface Saga {
    id: number;
    name: string;
    description: string;
}

export interface SkillDetail {
    level: number;
    progress: number;
    target: number;
}

export interface Skills {
    agility: SkillDetail;
    attack_speed: SkillDetail;
    defense: SkillDetail;
    fishing: SkillDetail;
    fist: SkillDetail;
    focus: SkillDetail;
    movement_speed: SkillDetail;
    weapon: SkillDetail;
}

export interface Vocation {
    id: number;
    name: string;
}

export interface Damage {
    given: number;
    taken: number;
}

export interface Player {
    id: number;
    name: string;
    vocation: Vocation;
    kills: number;
    deaths: number;
    assists: number;
    damage: Damage;
    healing: number;
}

export interface Teams {
    players: Player[];
}

export interface Event {
  id: number;
  name: string;
  time: number;
  teams: Teams;
}

export interface Character {
  id: number;
  name: string;
  level: number;
  saga: Saga;
  last_login: number;
  online_time: number;
  vocation: Vocation;
  skills: Skills;
  training_stamina: number;
  deaths: DeathsWrapper;
  events: Event[];
  exp_boost: number;
}

