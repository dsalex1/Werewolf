export interface User {
    id?: string;
    state: "creator" | "player" | "new" | "waiting";
    name?: string;
    role?: Role;
    mayor?: boolean;
}
export type Role = "werewolf" | "villager" | "amor" | "seer" | "witch";

export interface GameCreation {
    cards: {
        werewolf: number;
        villager: number;
        amor: number;
        seer: number;
        witch: number;
    };
    players: string[];
    started: boolean;
}

export type Player = User & {
    id: string;
    inLove?: boolean;
    deathmarked?: boolean;
    hasHealed?: boolean;
    protected?: boolean;
    hasKilled?: boolean;
    hasWon?: boolean | Role | "inLove";
    dead?: boolean;
};
export interface Players {
    self: Player;
    players: Player[];
    dead: Player[];
}
export type Event = "MAJOR" | "AMOR" | "SLEEP" | "SEER" | "WEREWOLF" | "WITCH" | "ANOUNCEMENT" | "ELECTION" | "GAMEOVER";
export type DayTime = "night" | "day";
export type Voting = {
    lockedIn?: string;
    votes: { src: string; target: string }[];
};
