import axios from "axios";

export const getItemOrElse = <T>(key: string, elseVal: T = {} as T) => {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    localStorage.setItem(key, JSON.stringify(elseVal));
    return elseVal;
};

const getAPI = async (path: string) => {
    return (await axios.get("http://localhost:8000" + path)).data;
};

const postAPI = async (path: string, body: Record<string, any>) => {
    return (await axios.post("http://localhost:8000" + path, body)).data;
};

export interface User {
    id?: number;
    state: "creator" | "player" | "new" | "waiting";
    name?: string;
    role?: "werewolf" | "villager" | "amor" | "seer" | "witch";
}
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

export const getUser = async (): Promise<User> => {
    return getAPI("/user");
};

export const setName = async (name: string): Promise<void> => {
    return postAPI("/setName", { name });
};

export const getGameCreation = async (): Promise<GameCreation> => {
    return getAPI("/creation");
};

export const setGameCreation = async (creation: GameCreation): Promise<void> => {
    return postAPI("/setCreation", creation);
};

export const startGame = async (creation: GameCreation): Promise<void> => {
    return postAPI("/startGame", creation);
};

export type Player = User & {
    id: number;
    selected: boolean;
    inLove: boolean;
};
interface Players {
    self: Player;
    players: Player[];
}
export const getPlayers = async (): Promise<Players> => {
    return getAPI("/players");
};

export const event = async (type: string, data: Record<string, any>): Promise<Players> => {
    return postAPI("/event/" + type, data);
};
