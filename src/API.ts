import axios from "axios";
export * from "./Types";
import { User, GameCreation, Players, DayTime, Voting, Event, Player } from "./Types";

export const getItemOrElse = <T>(key: string, elseVal: T = {} as T) => {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    localStorage.setItem(key, JSON.stringify(elseVal));
    return elseVal;
};

const getAPI = async (path: string) => {
    return (await axios.get("http://79.221.41.127:8081" + path)).data;
};

const postAPI = async (path: string, body: Record<string, any> = {}) => {
    return (await axios.post("http://79.221.41.127:8081" + path, body)).data;
};

export const getUser = async (): Promise<User> => {
    return getAPI("/user");
};

export const kickUser = async (id: string): Promise<User> => {
    return postAPI("/kickUser", { id });
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

export const event = async (type: Event, data?: Record<string, any>): Promise<Players> => {
    return postAPI("/event/" + type, data);
};

export const getGameState = async (): Promise<{
    players: Players;
    currentEvent: Event;
    dayTime: DayTime;
    voting: Voting;
    hasWon: string;
    hasStarted: boolean;
    newDeaths: Player[];
}> => {
    return getAPI("/gameState");
};

export const voteFor = async (id: string): Promise<void> => {
    return postAPI("/voteFor", { id });
};

export const startNew = async (): Promise<void> => {
    return postAPI("/startNew");
};
