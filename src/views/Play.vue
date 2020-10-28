<template>
    <div v-if="!loading" class="row pt-3" style="width:100vw;position:absolute;left:15px">
        <div class="col-8 pr-0">
            <div class="card" style="height:calc(100vh - 32px);">
                <div class="card-body">
                    <div
                        v-for="(player, i) in allPlayers"
                        :key="player.id"
                        :style="{
                            position: 'absolute',
                            left: Math.round(Math.sin(ellipsisCorrection(i / allPlayers.length)) * 42 + 50) + '%',
                            top: Math.round(-Math.cos(ellipsisCorrection(i / allPlayers.length)) * 38 + 50) + '%'
                        }"
                    >
                        <div
                            @click="playerClicked(player)"
                            class="text-center btn d-flex flex-column align-items-center"
                            :class="{ dead: player.dead }"
                            style="width:calc(4vw + 40px); position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);"
                        >
                            <div style="position:relative;">
                                <span v-if="voting.lockedIn == player.id" style="color: #289fa7;text-shadow: 1px 1px 3px #1e6383;">{{
                                    lockedInCounter
                                }}</span>
                                <img
                                    class="card-img-top"
                                    :class="{
                                        'own-card': player.id == self.id,
                                        'deathmarked-card':
                                            player.deathmarked && (self.role == 'werewolf' || (self.role == 'witch' && !player.protected)),
                                        'selected-card': selections.some(s => s == player.id),
                                        'selectedLocked-card': voting.lockedIn == player.id && (currentEvent == 'MAJOR' || self.role == 'werewolf')
                                    }"
                                    :src="
                                        player.id == self.id || player.id == seerSelected || player.dead
                                            ? require('../assets/' + player.role + '.jpg')
                                            : require('../assets/backside.jpg')
                                    "
                                    style="border-radius:5px;"
                                />
                                <img
                                    v-if="player.mayor"
                                    style="width:1.5vw;height:1.5vw;border-radius:2px;position:absolute;right:4px;top:4px"
                                    :src="require('../assets/mayor.jpg')"
                                />
                                <img
                                    v-if="player.inLove && self.inLove"
                                    style="width:1.5vw;height:1.5vw;border-radius:2px;position:absolute;left:4px;top:4px"
                                    :src="require('../assets/lovers.png')"
                                />
                                <div class="d-flex flex-wrap" style="position:absolute; top: 40%; left:0.54vw; width:calc(100% - 0.8vw); height:50%">
                                    <div
                                        v-for="j in Array.from(Array(getVotesPlayer(player)).keys())"
                                        :key="j"
                                        style="min-width:0.65vw;height:0.65vw;border-radius:4px;background-color:blue;margin:1px"
                                    ></div>
                                </div>
                            </div>
                            <div class="" style="width:calc(4vw + 80px);">{{ player.name }}</div>
                        </div>
                    </div>
                    <div
                        class="text-center flex-column d-flex align-items-center justify-content-center overflow-hidden"
                        style="width: calc(49vw - 90px); height:calc(46vh + -108px); position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);"
                    >
                        <!--
                        <div class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-info">schlafen...</div>
                        </div>-->
                        <div v-if="!showCurrentEvent()" class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-info">{{ dayTime == "night" ? "schlafen..." : "aufwachen..." }}</div>
                        </div>
                        <div v-else-if="currentEvent == 'MAJOR'" class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-info">
                                Wähle jemanden der Bürgermeister werden soll
                                <div class="text text-muted">Es wird gewählt bis einer die absolute Mehrheit hat</div>
                            </div>
                        </div>
                        <div v-else-if="currentEvent == 'AMOR'" class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-danger">zwei personen zum verlieben auswählen</div>
                            <button
                                :class="{ disabled: selectedPlayers.length != 2 }"
                                class="btn btn-primary"
                                @click="selectedPlayers.length == 2 && confirmAmor(selectedPlayers)"
                            >
                                confirm
                            </button>
                        </div>
                        <div v-else-if="currentEvent == 'SEER'" class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-info">Karte zum ansehen auswählen</div>
                            <button class="btn btn-primary" @click="confirmSeer(selectedPlayers)" v-if="!seerSelected">
                                confirm
                            </button>
                        </div>
                        <div v-else-if="currentEvent == 'WEREWOLF'" class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-danger">
                                Wähle ein Opfer
                                <div class="text text-muted">Es wird gewählt bis einer die absolute Mehrheit hat</div>
                            </div>
                        </div>

                        <div v-else-if="currentEvent == 'WITCH'" class="d-flex flex-column" style="width:70%">
                            <div v-if="!self.hasHealed && !hasDecidedHeal" class="d-flex flex-column">
                                <button class="btn btn-block btn-success mb-2" @click="witchHeal(true)">heilen</button>
                                <button class="btn btn-block btn-danger" @click="witchHeal(false)">nicht heilen</button>
                            </div>
                            <div v-else class="d-flex flex-column justify-content-stretch">
                                <button
                                    :class="{ disabled: selectedPlayers.length != 1 }"
                                    class="btn btn-danger mb-2"
                                    @click="selectedPlayers.length == 1 && witchKill(true, selectedPlayers[0])"
                                >
                                    töten
                                </button>
                                <button class="btn btn-success" @click="witchKill(false, null)">
                                    nicht töten
                                </button>
                            </div>
                        </div>
                        <div v-else-if="currentEvent == 'GAMEOVER'" class="d-flex flex-column" style="width:70%">
                            <div class="alert" :class="{ 'alert-danger': !self.hasWon, 'alert-success': self.hasWon }">
                                Spiel Vorbei<br />
                                {{
                                    (hasWon == "villager" && "Das Dorf hat") ||
                                        (hasWon == "werewolf" && "Die Werwölfe haben") ||
                                        (hasWon == "inLove" && "Das Liebespaar hat")
                                }}
                                gewonnen
                            </div>
                        </div>
                        <!--
                        <div class="d-flex flex-column" style="width:70%">
                            
                            <button class="btn btn-primary">confirm</button>
                        </div>
                        <div class="d-flex flex-column" style="width:70%">
                            <button class="btn btn-success mb-2">heilen</button>
                            <button class="btn btn-danger">nicht heilen</button>
                        </div>
                        <div class="d-flex flex-column" style="width:70%">
                            <button class="btn btn-danger mb-2">töten</button>
                            <button class="btn btn-success">nicht töten</button>
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card">
                <div class="card-header">Your Role</div>
                <div class="card-body d-flex flex-column">
                    <div class="card text-center align-self-center" style="max-width:50%">
                        <img class="card-img-top" :src="require('../assets/' + self.role + '.jpg')" style="border-radius:5px" />
                        <div class="card-footer vertical-align-center">{{ self.role }}</div>
                    </div>
                    <h6 class="card-subtitle mt-2 mb-2 text-muted">Description</h6>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <h6 class="card-subtitle mb-2 text-muted">Objective</h6>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue, Watch } from "vue-property-decorator";
import * as API from "../API";

declare let $: any;

@Component({})
export default class Play extends Vue {
    private loading = true;
    private players: API.Player[] = [];
    private dead: API.Player[] = [];
    private self: API.Player = {} as API.Player;
    private interval = -1;
    private dayTime: API.DayTime = "day";
    private canSelect = false;
    private canSelectMultiple = false;
    private currentEvent: API.Event = "NONE" as API.Event;
    private voting: API.Voting = { votes: [] };
    private selections: string[] = [];
    private lockedInTimeout = -1;
    private lockedInCounter = 3;
    private seerSelected: string | null = null;
    private hasDecidedHeal = false;
    private hasWon = "";

    ellipsisCorrection(x: number) {
        // with b=2: x-((-1+Math.sqrt(b))*Math.cos(x)*Math.sin(x))/(1+Math.sqrt(b))
        // inside f(x * 2 * Math.PI)
        return 2 * x * Math.PI + (-3 / 2 + Math.sqrt(2)) * Math.sin(4 * Math.PI * x);
    }
    get allPlayers() {
        return [...this.players.map(p => ({ ...p, dead: false })), ...this.dead.map(p => ({ ...p, dead: true }))].sort((p1, p2) =>
            p1.id > p2.id ? 1 : -1
        );
    }

    @Watch("dayTime")
    setNight() {
        if (this.dayTime == "night") document.getElementsByTagName("body")[0].classList.add("night");
        else document.getElementsByTagName("body")[0].classList.remove("night");
    }

    showCurrentEvent() {
        switch (this.currentEvent) {
            case "MAJOR":
                return true;
            case "AMOR":
                return this.self.role == "amor";
            case "SEER":
                return this.self.role == "seer";
            case "WEREWOLF":
                return this.self.role == "werewolf";
            case "WITCH":
                return this.self.role == "witch";
            case "GAMEOVER":
                return true;
        }
        return false;
    }

    @Watch("currentEvent")
    scheduleNextEvent() {
        this.canSelect = false;
        this.canSelectMultiple = false;
        switch (this.currentEvent) {
            case "SLEEP":
                return;
            case "AMOR":
                this.currentEvent = "AMOR";
                this.canSelectMultiple = true;
                this.canSelect = this.self.role == "amor";
                return;
            case "MAJOR":
                this.canSelect = true;
                return;
            case "SEER":
                this.canSelect = this.self.role == "seer";
                return;
            case "WEREWOLF":
                this.canSelect = this.self.role == "werewolf";
                return;
            case "WITCH":
                this.canSelect = this.self.role == "witch" && (this.hasDecidedHeal || this.self.hasHealed!);
                return;
        }
    }
    @Watch("canSelect")
    unselectPlayers() {
        this.selections = [];
    }

    async confirmAmor(selectedPlayers: API.Player[]) {
        await API.event("AMOR", { id1: selectedPlayers[0].id, id2: selectedPlayers[1].id });
    }

    async confirmSeer(selectedPlayers: API.Player[]) {
        this.seerSelected = selectedPlayers[0].id;
        await (async () => new Promise(resolve => setTimeout(resolve, 3000)))();
        this.seerSelected = "-1";
        await API.event("SEER");
    }
    async witchHeal(heal: boolean) {
        if (heal) {
            this.self.hasHealed = true;
            this.players.find(p => p.deathmarked)!.protected = true;
            API.event("WITCH", { pot: "heal" });
        }
        this.hasDecidedHeal = true;
        if (this.self.hasKilled) this.currentEvent = "SLEEP";
        this.scheduleNextEvent();
    }
    async witchKill(kill: boolean, target: API.Player) {
        if (kill) {
            this.self.hasKilled = true;
            target.deathmarked = true;
        }
        API.event("WITCH", { pot: "kill", target: kill ? target.id : null });
        this.currentEvent = "SLEEP";
        this.scheduleNextEvent();
    }

    get selectedPlayers() {
        return this.players.filter(p => this.selections.some(s => s == p.id));
    }

    async mounted() {
        this.loading = true;
        const update = async () => {
            const req = await API.getGameState();
            this.players = req.players.players;
            this.dead = req.players.dead;
            this.voting = req.voting;
            this.self = req.players.self;
            this.currentEvent = req.currentEvent;
            this.dayTime = req.dayTime;
            this.hasWon = req.hasWon;
        };
        await update();
        this.loading = false;

        this.interval = setInterval(update, 1000);
    }
    async destroyed() {
        clearInterval(this.interval);
    }

    async playerClicked(player: API.Player) {
        if (!this.canSelect) return;

        if (this.selectedPlayers.some(p => p.id == player.id)) {
            if (this.canSelectMultiple) this.selections = this.selections.filter(s => s != player.id);
        } else {
            if (this.canSelectMultiple) this.selections.push(player.id);
            else this.selections = [player.id];
        }

        let chosen;
        let eligibilePlayers;
        switch (this.currentEvent) {
            case "WEREWOLF":
            case "MAJOR":
                eligibilePlayers = this.currentEvent == "MAJOR" ? this.players : this.players.filter(p => p.role == "werewolf");

                if (this.voting.votes.find(v => v.src == this.self.id)) this.voting.votes.find(v => v.src == this.self.id)!.target = player.id;
                else this.voting.votes.push({ src: this.self.id, target: player.id });
                API.voteFor(player.id);
                chosen = false;
                if (this.voting.votes.length == eligibilePlayers.length) {
                    for (const user of this.players) {
                        if (this.voting.votes.filter(v => v.target == user.id).length > eligibilePlayers.length / 2) {
                            this.voting.lockedIn = user.id;
                            chosen = true;
                        }
                    }
                }
                if (!chosen) {
                    this.voting.lockedIn = undefined;
                }
                return;
            case "SEER":
                this.selections = this.selections.filter(s => s != this.self.id);
        }
    }

    @Watch("voting.lockedIn", { immediate: true, deep: true })
    rescheduleLockedInTimeout(newId?: string, oldId?: string) {
        console.log("it changed");
        if (newId === undefined) return clearTimeout(this.lockedInTimeout);
        if (oldId != newId) {
            this.lockedInCounter = 3;
            this.lockedInTimeout = setTimeout(() => {
                this.lockedInCounter = 2;
                this.lockedInTimeout = setTimeout(() => {
                    this.lockedInCounter = 1;
                }, 1000);
            }, 1000);
        }
    }
    getVotesPlayer(player: API.Player) {
        switch (this.currentEvent) {
            case "MAJOR":
            case "WEREWOLF":
                return this.voting.votes.reduce((a, c) => a + (c.target == player.id ? 1 : 0), 0);
        }
        return 0;
    }

    updatePlayer(player: API.Player, data: Record<string, unknown>) {
        this.players.splice(
            this.players.findIndex(p => p.id == player.id),
            1,
            { ...player, ...data }
        );
    }
}
</script>
<style>
.own-card {
    border: 1px solid #1e8335;
    box-shadow: 0 0 8px 4px #28a745;
}
.selected-card {
    border: 1px solid #201e83;
    box-shadow: 0 0 8px 4px #282aa7;
}
.selectedLocked-card {
    border: 1px solid #1e6383;
    box-shadow: 0 0 8px 4px #289fa7;
}
.deathmarked-card {
    border: 1px solid #831e1e;
    box-shadow: 0 0 8px 4px #a72828;
}
.dead {
    opacity: 0.6;
    filter: grayscale(100%);
    cursor: unset !important;
}
</style>
