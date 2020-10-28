/* eslint-disable @typescript-eslint/no-var-requires */
console.clear();
const express = require("express");
const cors = require("cors");
const app: App = express();
import { User, GameCreation, Player, Players, Event, DayTime, Voting, Role } from "./src/Types";
import { visitNodes } from "typescript";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

type App = {
    [x: string]: any;
    get: <T>(a: any, b: any, f: (req: reqType, res: { json: (obj: T) => T; status: any }) => T) => void;
    post: <T>(a: any, b: any, f: (req: reqType, res: { json: (obj: T) => T; status: any }) => T) => void;
};

type reqType = {
    headers: { authorization: string };
    user: Player;
};

const oldLog = console.log;
console.log = (...args) => {
    oldLog("[SERVER]", ...args);
};

app.options("*", cors());
app.use(express.json());

const newUsers: Omit<User, "name">[] = [];

let players: Player[] = [
    /*
    { id: "09007728297802164", name: "p2", state: "player", role: "witch", inLove: true },
    { id: "5563432431161994", name: "p3", state: "player", role: "werewolf", inLove: true },
    { id: "6473568877355735", name: "creator", state: "player", role: "seer", mayor: true, deathmarked: true },
    { id: "6305879575129216", name: "p1", state: "player", role: "amor" }
*/
];

let dead: Player[] = [];

const gameCreation: Omit<GameCreation, "players"> = {
    cards: {
        werewolf: 0,
        villager: 0,
        amor: 0,
        seer: 0,
        witch: 0
    },
    started: false
};

const voting: Voting = { lockedIn: undefined, votes: [] };

let currentEvent: Event = "MAJOR";
let dayTime: DayTime = "day";
let hasWon = "";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function startGame() {
    players.forEach(p => (p.state = "player"));

    const cards = [];
    for (const card of Object.keys(gameCreation.cards)) for (let i = 0; i < gameCreation.cards[card]; i++) cards.push(card);

    shuffleArray(cards);

    players.forEach((p, i) => (p.role = cards[i]));
}
function baseRole(role: Role): Role {
    switch (role) {
        case "amor":
        case "seer":
        case "witch":
        case "villager":
            return "villager";
        default:
            return role;
    }
}
function computeWon(): string {
    if (players.filter(p => !p.inLove).length == 0) {
        players.filter(p => p.inLove).forEach(p => (p.hasWon = true));
        dead.filter(p => p.inLove).forEach(p => (p.hasWon = true));
        console.log("inLove has won");
        return "inLove";
    }
    if (players.filter(p => baseRole(p.role) == "villager").length == 0) {
        players.filter(p => baseRole(p.role) == "werewolf").forEach(p => (p.hasWon = true));
        dead.filter(p => baseRole(p.role) == "werewolf").forEach(p => (p.hasWon = true));
        console.log("werewolf has won");
        return "werewolf";
    }
    if (players.filter(p => baseRole(p.role) == "werewolf").length == 0) {
        players.filter(p => baseRole(p.role) == "villager").forEach(p => (p.hasWon = true));
        dead.filter(p => baseRole(p.role) == "villager").forEach(p => (p.hasWon = true));
        console.log("villager has won");
        return "villager";
    }
    return "";
}
async function computeDead() {
    players.forEach(p => {
        console.log("testing :" + p);
        if (p.deathmarked && !p.protected) {
            if (p.inLove) {
                dead = [...dead, ...players.filter(p => p.inLove).map(p => ({ ...p, mayor: false }))];
                players = players.filter(p => !p.inLove);
                return;
            }
            dead = [...dead, ...players.filter(p2 => p2.id == p.id).map(p => ({ ...p, mayor: false }))];
            players = players.filter(p2 => p2.id != p.id);
        }
    });
    currentEvent = "ANOUNCEMENT";
    sleep(3000);
    hasWon = computeWon();
    if (hasWon) currentEvent = "GAMEOVER";
    else if (players.some(p => p.mayor)) currentEvent = "MAJOR";
    else currentEvent = "ELECTION";
}

app.get<Player | User>("/user", cors(), (req, res) => {
    if (
        !newUsers.find(u => u.id == req.headers.authorization) &&
        !players.find(u => u.id == req.headers.authorization) &&
        !dead.find(u => u.id == req.headers.authorization)
    ) {
        console.log("registered " + req.headers.authorization);
        newUsers.push({ state: "new", id: req.headers.authorization });
        console.log("newUsers", newUsers);
        console.log("users", players);
    }
    if (newUsers.find(u => u.id == req.headers.authorization)) return res.json(newUsers.find(u => u.id == req.headers.authorization));
    else if (players.find(u => u.id == req.headers.authorization)) return res.json(players.find(u => u.id == req.headers.authorization));
    else return res.json(dead.find(u => u.id == req.headers.authorization));
});

app.post("/setName", cors(), (req: reqType & { body: { name: string } }, res) => {
    if (!newUsers.find(u => u.id == req.headers.authorization)) return res.status(401).json(players);

    newUsers.splice(
        newUsers.findIndex(u => u.id == req.headers.authorization),
        1
    );

    let state;
    if (Object.values(players).filter(u => u.name).length == 0) state = "creator";
    else state = "waiting";

    players.push({ id: req.headers.authorization, name: req.body["name"] || "anonymous", state });

    console.log("set name " + req.headers.authorization + " " + req.body["name"]);
    console.log("users", players);

    res.json({ status: "ok" });
});

app.post("/setCreation", cors(), (req: reqType & { body: GameCreation }, res) => {
    req.user = players.find(u => u.id == req.headers.authorization);
    if (!req.user) return res.status(401).json(players);

    gameCreation.cards = req.body["cards"];
    gameCreation.started = req.body["started"];

    if (gameCreation.started) {
        startGame();
    }

    res.json({ status: "ok" });
});

app.get<GameCreation>("/creation", cors(), (req, res) =>
    res.json({
        ...gameCreation,
        players: players.map(u => u.name)
    })
);

app.get<Players>("/players", cors(), (req, res) =>
    res.json({
        self: {
            id: req.headers.authorization,
            ...players.find(u => u.id == req.headers.authorization)
        },
        players,
        dead
    })
);

app.get<{ players: Players; currentEvent: Event; dayTime: DayTime; voting: Voting; hasWon: string }>("/gameState", cors(), (req, res) =>
    res.json({
        players: {
            self: players.find(u => u.id == req.headers.authorization) || dead.find(u => u.id == req.headers.authorization),
            players,
            dead
        },
        currentEvent,
        dayTime,
        voting,
        hasWon
    })
);

app.post("/event/AMOR", cors(), (req: reqType & { body: { id1: string; id2: string } }, res) => {
    console.log("AMOR " + req.body["id1"] + " + " + req.body["id2"]);
    players.find(u => u.id == req.body["id1"]).inLove = true;
    players.find(u => u.id == req.body["id2"]).inLove = true;

    currentEvent = "SEER";

    res.json({ status: "ok" });
});

app.post("/event/SEER", cors(), (req: reqType, res) => {
    console.log("SEER");

    currentEvent = "WEREWOLF";
    res.json({ status: "ok" });
});

app.post("/event/WITCH", cors(), (req: reqType & { body: { pot: "heal" | "death"; target?: string | null } }, res) => {
    req.user = players.find(u => u.id == req.headers.authorization);
    if (req.body.pot == "heal") {
        console.log("WITCH healed");
        req.user.hasHealed = true;
        players.find(p => p.deathmarked)!.protected = true;
    } else {
        if (req.body.target) {
            req.user.hasKilled = true;
            players.find(p => p.id == req.body.target).deathmarked = true;
        }
        currentEvent = "SLEEP";
        dayTime = "day";
        setTimeout(() => {
            computeDead();
        }, 3000);
    }
    res.json({ status: "ok" });
});

let lockedInTimeout: NodeJS.Timeout;

app.post("/voteFor", cors(), (req: reqType & { body: { id: string } }, res) => {
    req.user = players.find(u => u.id == req.headers.authorization);
    console.log("voting " + req.user.name + " for " + req.body.id);
    if (voting.votes.find(v => v.src == req.user.id)) voting.votes.find(v => v.src == req.user.id).target = req.body.id;
    else voting.votes.push({ src: req.user.id, target: req.body.id });

    const eligibilePlayers = currentEvent == "MAJOR" ? players : players.filter(p => p.role == "werewolf");
    if (voting.votes.length == eligibilePlayers.length) {
        let chosen = false;
        for (const user of players) {
            if (voting.votes.filter(v => v.target == user.id).length > eligibilePlayers.length / 2) {
                voting.lockedIn = user.id;
                console.log("locked in: " + user.id);
                clearTimeout(lockedInTimeout);
                if (currentEvent == "MAJOR")
                    lockedInTimeout = setTimeout(async () => {
                        console.log("thus the leader hath been chosen: " + user.id);
                        players.find(u => u.id == user.id).mayor = true;
                        voting.lockedIn = undefined;
                        voting.votes = [];
                        dayTime = "night";
                        currentEvent = "SLEEP";
                        await sleep(3000);
                        currentEvent = "AMOR";
                    }, 3000);
                else {
                    lockedInTimeout = setTimeout(async () => {
                        console.log("thus the victim hath been chosen: " + user.id);
                        players.find(u => u.id == user.id).deathmarked = true;
                        voting.lockedIn = undefined;
                        voting.votes = [];
                        dayTime = "night";
                        currentEvent = "SLEEP";
                        await sleep(3000);
                        currentEvent = "WITCH";
                    }, 3000);
                }
                chosen = true;
            }
        }
        if (!chosen) {
            voting.lockedIn = undefined;
            clearTimeout(lockedInTimeout);
        }
    }
    res.json({ status: "ok" });
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});
