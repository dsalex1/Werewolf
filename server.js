"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-var-requires */
//run: tsc-watch server.ts --onSuccess "node server.js"
console.clear();
var express = require("express");
var cors = require("cors");
var app = express();
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var oldLog = console.log;
console.log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    oldLog.apply(void 0, __spreadArrays(["[SERVER]"], args));
};
app.options("*", cors());
app.use(express.json());
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var newUsers = [];
var players = [
    { id: "20032798064716228", name: "creator", state: "player", role: "werewolf" },
    //{ id: "09007728297802164", name: "p1", state: "player", role: "werewolf" },
    { id: "39065619909131755", name: "p2", state: "player", role: "werewolf" },
    { id: "3934182564683921", name: "p3", state: "player", role: "villager" }
];
var dead = [];
var gameCreation = {
    cards: {
        werewolf: 3,
        villager: 1,
        amor: 0,
        seer: 0,
        witch: 0
    },
    started: true
};
var voting = { lockedIn: undefined, votes: [] };
var dayTime = "day";
var hasWon = "";
var isFirstRound = true;
var currentEvent = "MAJOR";
function skippingEvent(event) {
    //if none left alive (or there in the first place) skip
    switch (event) {
        case "AMOR":
        case "WEREWOLF":
        case "WITCH":
        case "SEER":
            if (!players.some(function (p) { return p.role.toUpperCase() == event; }))
                return true;
    }
    //role/event specific rules
    switch (event) {
        case "MAJOR":
            if (players.some(function (p) { return p.mayor; }))
                return true;
            break;
        case "ELECTION":
            if (isFirstRound)
                return true;
            break;
        case "AMOR":
            if (!isFirstRound)
                return true;
            break;
        case "WITCH":
            if (players.find(function (p) { return p.role == "witch"; }).hasHealed && players.find(function (p) { return p.role == "witch"; }).hasKilled)
                return true;
            break;
    }
    return false;
}
function getNextScheduleEvent(event) {
    var schedule = ["MAJOR", "ELECTION", "AMOR", "SEER", "WEREWOLF", "WITCH", "ANOUNCEMENT"];
    var currentScheduleIndex = schedule.findIndex(function (e) { return e == event; });
    var nextScheduleEvent = schedule[(currentScheduleIndex + 1) % schedule.length];
    //after the first werewolf the first round is basically over
    if (event == "WEREWOLF" && isFirstRound)
        isFirstRound = false;
    if (skippingEvent(nextScheduleEvent)) {
        return getNextScheduleEvent(nextScheduleEvent);
    }
    else
        return nextScheduleEvent;
}
function nextScheduleEvent() {
    return __awaiter(this, void 0, void 0, function () {
        var nextEvent;
        return __generator(this, function (_a) {
            nextEvent = getNextScheduleEvent(currentEvent);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            if (nextEvent == "ANOUNCEMENT")
                computeDead();
            if (nextEvent == "ANOUNCEMENT")
                dayTime = "day";
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            if (currentEvent == "ELECTION" && checkWon())
                return [2 /*return*/];
            currentEvent = nextEvent;
            return [2 /*return*/];
        });
    });
}
function eventSleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        var lastEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastEvent = currentEvent;
                    currentEvent == "SLEEP";
                    return [4 /*yield*/, sleep(ms)];
                case 1:
                    _a.sent();
                    currentEvent = lastEvent;
                    nextScheduleEvent();
                    return [2 /*return*/];
            }
        });
    });
}
var prompt = function () {
    rl.question(">", function (name) {
        switch (name) {
            case "c":
            case "clear":
                console.clear();
                break;
            case "d":
            case "dump":
                console.log("gameCreation", gameCreation);
                console.log("players", players);
                console.log("currentEvent", currentEvent);
                break;
        }
        prompt();
    });
};
prompt();
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function startGame() {
    players.forEach(function (p) { return (p.state = "player"); });
    var cards = [];
    for (var _i = 0, _a = Object.keys(gameCreation.cards); _i < _a.length; _i++) {
        var card = _a[_i];
        for (var i = 0; i < gameCreation.cards[card]; i++)
            cards.push(card);
    }
    shuffleArray(cards);
    players.forEach(function (p, i) { return (p.role = cards[i]); });
}
function baseRole(role) {
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
function computeWon() {
    if (players.filter(function (p) { return !p.inLove; }).length == 0 && players.filter(function (p) { return p.inLove; }).length >= 2) {
        players.filter(function (p) { return p.inLove; }).forEach(function (p) { return (p.hasWon = true); });
        dead.filter(function (p) { return p.inLove; }).forEach(function (p) { return (p.hasWon = true); });
        console.log("inLove has won");
        return "inLove";
    }
    if (players.filter(function (p) { return baseRole(p.role) == "villager"; }).length == 0) {
        players.filter(function (p) { return baseRole(p.role) == "werewolf"; }).forEach(function (p) { return (p.hasWon = true); });
        dead.filter(function (p) { return baseRole(p.role) == "werewolf"; }).forEach(function (p) { return (p.hasWon = true); });
        console.log("werewolf has won");
        return "werewolf";
    }
    if (players.filter(function (p) { return baseRole(p.role) == "werewolf"; }).length == 0) {
        players.filter(function (p) { return baseRole(p.role) == "villager"; }).forEach(function (p) { return (p.hasWon = true); });
        dead.filter(function (p) { return baseRole(p.role) == "villager"; }).forEach(function (p) { return (p.hasWon = true); });
        console.log("villager has won");
        return "villager";
    }
    return "";
}
function makeDead() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            players.forEach(function (p) {
                console.log("testing :" + p);
                if (p.deathmarked && !p.protected) {
                    if (p.inLove) {
                        dead = __spreadArrays(dead, players.filter(function (p) { return p.inLove; }).map(function (p) { return (__assign(__assign({}, p), { mayor: false })); }));
                        players = players.filter(function (p) { return !p.inLove; });
                        return;
                    }
                    dead = __spreadArrays(dead, players.filter(function (p2) { return p2.id == p.id; }).map(function (p) { return (__assign(__assign({}, p), { mayor: false })); }));
                    players = players.filter(function (p2) { return p2.id != p.id; });
                }
            });
            return [2 /*return*/];
        });
    });
}
function checkWon() {
    hasWon = computeWon();
    if (hasWon)
        currentEvent = "GAMEOVER";
    return !!hasWon;
}
function computeDead() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    makeDead();
                    //clear markings from last night
                    players = players.map(function (p) { return (__assign(__assign({}, p), { deathmarked: undefined, protected: undefined })); });
                    return [4 /*yield*/, sleep(3000)];
                case 1:
                    _a.sent();
                    if (!checkWon())
                        nextScheduleEvent();
                    return [2 /*return*/];
            }
        });
    });
}
app.get("/user", cors(), function (req, res) {
    if (!newUsers.find(function (u) { return u.id == req.headers.authorization; }) &&
        !players.find(function (u) { return u.id == req.headers.authorization; }) &&
        !dead.find(function (u) { return u.id == req.headers.authorization; })) {
        console.log("registered " + req.headers.authorization);
        newUsers.push({ state: "new", id: req.headers.authorization });
        console.log("newUsers", newUsers);
        console.log("users", players);
    }
    if (newUsers.find(function (u) { return u.id == req.headers.authorization; }))
        return res.json(newUsers.find(function (u) { return u.id == req.headers.authorization; }));
    else if (players.find(function (u) { return u.id == req.headers.authorization; }))
        return res.json(players.find(function (u) { return u.id == req.headers.authorization; }));
    else
        return res.json(dead.find(function (u) { return u.id == req.headers.authorization; }));
});
app.post("/setName", cors(), function (req, res) {
    if (!newUsers.find(function (u) { return u.id == req.headers.authorization; }))
        return res.status(401).json(players);
    newUsers.splice(newUsers.findIndex(function (u) { return u.id == req.headers.authorization; }), 1);
    var state;
    if (Object.values(players).filter(function (u) { return u.name; }).length == 0)
        state = "creator";
    else
        state = "waiting";
    players.push({ id: req.headers.authorization, name: req.body["name"] || "anonymous", state: state });
    console.log("set name " + req.headers.authorization + " " + req.body["name"]);
    console.log("users", players);
    res.json({ status: "ok" });
});
app.post("/setCreation", cors(), function (req, res) {
    req.user = players.find(function (u) { return u.id == req.headers.authorization; });
    if (!req.user)
        return res.status(401).json(players);
    gameCreation.cards = req.body["cards"];
    gameCreation.started = req.body["started"];
    if (gameCreation.started) {
        startGame();
    }
    res.json({ status: "ok" });
});
app.get("/creation", cors(), function (req, res) {
    return res.json(__assign(__assign({}, gameCreation), { players: players.map(function (u) { return u.name; }) }));
});
app.get("/players", cors(), function (req, res) {
    return res.json({
        self: __assign({ id: req.headers.authorization }, players.find(function (u) { return u.id == req.headers.authorization; })),
        players: players,
        dead: dead
    });
});
app.get("/gameState", cors(), function (req, res) {
    return res.json({
        players: {
            self: players.find(function (u) { return u.id == req.headers.authorization; }) || dead.find(function (u) { return u.id == req.headers.authorization; }),
            players: players,
            dead: dead
        },
        currentEvent: currentEvent,
        dayTime: dayTime,
        voting: voting,
        hasWon: hasWon
    });
});
app.post("/event/AMOR", cors(), function (req, res) {
    console.log("AMOR " + req.body["id1"] + " + " + req.body["id2"]);
    players.find(function (u) { return u.id == req.body["id1"]; }).inLove = true;
    players.find(function (u) { return u.id == req.body["id2"]; }).inLove = true;
    nextScheduleEvent();
    res.json({ status: "ok" });
});
app.post("/event/SEER", cors(), function (req, res) {
    console.log("SEER");
    nextScheduleEvent();
    res.json({ status: "ok" });
});
app.post("/event/WITCH", cors(), function (req, res) {
    req.user = players.find(function (u) { return u.id == req.headers.authorization; });
    if (req.body.pot == "heal") {
        console.log("WITCH healed");
        req.user.hasHealed = true;
        players.find(function (p) { return p.deathmarked; }).protected = true;
    }
    else {
        //is death pot
        if (req.body.target) {
            req.user.hasKilled = true;
            players.find(function (p) { return p.id == req.body.target; }).deathmarked = true;
        }
        eventSleep(3000);
    }
    res.json({ status: "ok" });
});
var lockedInTimeout;
app.post("/voteFor", cors(), function (req, res) {
    req.user = players.find(function (u) { return u.id == req.headers.authorization; });
    console.log("voting " + req.user.name + " for " + req.body.id);
    if (voting.votes.find(function (v) { return v.src == req.user.id; }))
        voting.votes.find(function (v) { return v.src == req.user.id; }).target = req.body.id;
    else
        voting.votes.push({ src: req.user.id, target: req.body.id });
    var eligibilePlayers = currentEvent == "WEREWOLF" ? players.filter(function (p) { return p.role == "werewolf"; }) : players;
    if (voting.votes.length == eligibilePlayers.length) {
        var chosen = false;
        var _loop_1 = function (user) {
            if (voting.votes.filter(function (v) { return v.target == user.id; }).length > eligibilePlayers.length / 2) {
                voting.lockedIn = user.id;
                console.log("locked in: " + user.id);
                clearTimeout(lockedInTimeout);
                if (currentEvent == "WEREWOLF")
                    lockedInTimeout = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log("thus the victim hath been chosen: " + user.id);
                            players.find(function (u) { return u.id == user.id; }).deathmarked = true;
                            voting.lockedIn = undefined;
                            voting.votes = [];
                            dayTime = "night";
                            eventSleep(3000);
                            return [2 /*return*/];
                        });
                    }); }, 3000);
                else if (currentEvent == "MAJOR") {
                    lockedInTimeout = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log("thus the leader hath been chosen: " + user.id);
                            players.find(function (u) { return u.id == user.id; }).mayor = true;
                            voting.lockedIn = undefined;
                            voting.votes = [];
                            if (isFirstRound)
                                dayTime = "night";
                            eventSleep(3000);
                            return [2 /*return*/];
                        });
                    }); }, 3000);
                }
                else {
                    lockedInTimeout = setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("the hangee hath been chosen: " + user.id);
                                    players.find(function (u) { return u.id == user.id; }).deathmarked = true;
                                    return [4 /*yield*/, makeDead()];
                                case 1:
                                    _a.sent();
                                    voting.lockedIn = undefined;
                                    voting.votes = [];
                                    dayTime = "night";
                                    eventSleep(3000);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 3000);
                }
                chosen = true;
            }
        };
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var user = players_1[_i];
            _loop_1(user);
        }
        if (!chosen) {
            voting.lockedIn = undefined;
            clearTimeout(lockedInTimeout);
        }
    }
    res.json({ status: "ok" });
});
app.listen(8081, function () {
    console.log("Server running on port 8081");
});
