/* eslint-disable @typescript-eslint/no-var-requires */
console.clear();
const express = require("express");
const cors = require("cors");
const app = express();

app.options("*", cors());
app.use(express.json());
 
//const users = {};
const users={
    '09007728297802164': { name: 'creator', state: 'player', role:"amor" },
    '6473568877355735': { name: 'player', state: 'player', role: "werewolf" },
    '6473568877355736': { name: 'player', state: 'player', role: "witch" },
    '6473568877355737': { name: 'player', state: 'player', role: "seer" }
} 
const newUsers = {};

const gameCreation = {
    cards: {
        werewolf: 1, 
        villager: 0,
        amor: 1,
        seer: 0,
        witch: 0
    },
    started: true
};

const oldLog = console.log;
console.log = (...args) => {
    oldLog("[SERVER]", ...args);
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function startGame (){
    for (const key of Object.keys(users))
        users[key].state = "player"
    
    const cards=[]
    for (const card of Object.keys(gameCreation.cards))
        for (let i = 0; i < gameCreation.cards[card]; i++)
            cards.push(card)
    
    shuffleArray(cards);

    for (let i = 0; i < Object.keys(users).length; i++)
        users[Object.keys(users)[i]].role = cards[i];
}

app.get("/user", cors(), (req, res) => {
    if (!newUsers[req.headers.authorization] && !users[req.headers.authorization]) {
        console.log("registered " + req.headers.authorization);
        newUsers[req.headers.authorization] = { state: "new" };
        console.log("newUsers", newUsers); 
        console.log("users", users);
    }
    if (newUsers[req.headers.authorization])
        res.json(newUsers[req.headers.authorization]);
    else
        res.json(users[req.headers.authorization]);
});
 
app.post("/setName", cors(), (req, res) => {
    req.user = newUsers[req.headers.authorization];
    if (!req.user) return res.status(401).json(users);

    delete newUsers[req.headers.authorization];

    users[req.headers.authorization] = { name: req.body["name"] || "anonymous"}
    req.user = users[req.headers.authorization];

    if (Object.values(users).filter(u => u.name).length == 1) req.user.state = "creator";
    else req.user.state = "waiting";

    console.log("set name " + req.headers.authorization + " " + req.user.name);
    console.log("users", users);

    res.json({ status: "ok" });
}); 

app.post("/setCreation", cors(), (req, res) => { 
    req.user = users[req.headers.authorization]; 
    if (!req.user) return res.status(401).json(users);

    gameCreation.cards = req.body["cards"]; 
    gameCreation.started = req.body["started"];

    if (gameCreation.started) {
        startGame();
    }

    res.json({ status: "ok" });
});

app.get("/creation", cors(), (req, res) =>
    res.json({
        ...gameCreation,
        players: Object.values(users)
            .map(u => u.name)
    })
);

app.get("/players", cors(), (req, res) =>
    res.json({
        self: {
            id: req.headers.authorization, ...users[req.headers.authorization]
        },
        players: Object.entries(users)
            .map(([key, user]) => ({ id: key, ...user }))
    })
); 

app.post("/event/AMOR", cors(), (req, res) => {
    console.log("AMOR " + req.body["id1"] + " + " + req.body["id2"])
    users[req.body["id1"]].inLove = true;
    users[req.body["id2"]].inLove = true;

    res.json({ status: "ok" });
}); 

app.listen(8000, () => {
    console.log("Server running on port 8000");
});
