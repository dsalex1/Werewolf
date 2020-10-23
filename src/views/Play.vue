<template>
    <div v-if="!loading" class="row pt-3" style="width:100vw;position:absolute;left:15px">
        <div class="col-8 pr-0">
            <div class="card" style="height:calc(100vh - 32px);">
                <div class="card-body">
                    <div
                        v-for="(player, i) in players"
                        :key="player.id"
                        :style="{
                            position: 'absolute',
                            left: Math.round(Math.sin(ellipsisCorrection(i / players.length)) * 42 + 50) + '%',
                            top: Math.round(-Math.cos(ellipsisCorrection(i / players.length)) * 38 + 50) + '%'
                        }"
                    >
                        <div
                            @click="playerClicked(player)"
                            class="text-center btn d-flex flex-column align-items-center"
                            style="width:calc(4vw + 40px); position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);"
                        >
                            <div style="position:relative; /*opacity:0.6; /*filter: grayscale(100%);">
                                <img
                                    class="card-img-top"
                                    :class="{
                                        'own-card': player.id == self.id,
                                        'deathmarked-card': player.deathmarked,
                                        'selected-card': player.selected,
                                        'selectedLocked-card': player.lockedin
                                    }"
                                    :src="player.id == self.id ? require('../assets/' + self.role + '.jpg') : require('../assets/backside.jpg')"
                                    style="border-radius:5px;"
                                />
                                <img
                                    v-if="false"
                                    style="width:1.5vw;height:1.5vw;border-radius:2px;position:absolute;right:4px;top:4px"
                                    :src="require('../assets/mayor.jpg')"
                                />
                                <img
                                    v-if="false"
                                    style="width:1.5vw;height:1.5vw;border-radius:2px;position:absolute;left:4px;top:4px"
                                    :src="require('../assets/lovers.png')"
                                />
                                <div class="d-flex flex-wrap" style="position:absolute; top: 40%; left:0.54vw; width:calc(100% - 0.8vw); height:50%">
                                    <div
                                        v-for="j in Array.from(Array(0).keys())"
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
                            <div class="alert alert-info">schlafen...</div>
                        </div>
                        <div v-else-if="currentEvent == 'AMOR'" class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-danger">zwei personen zum verlieben auswählen</div>
                            <button :class="{ disabled: selectedPlayers.length != 2 }" class="btn btn-primary" @click="confirmAmor(selectedPlayers)">
                                confirm
                            </button>
                        </div>
                        <!--
                        <div class="d-flex flex-column" style="width:70%">
                            <div class="alert alert-info">Karte zum ansehen auswählen</div>
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
import { Component, Vue } from "vue-property-decorator";
import * as API from "../API";

declare let $: any;

@Component({})
export default class Play extends Vue {
    private loading = true;
    private players: API.Player[] = [];
    private self: API.Player = {} as API.Player;
    private interval = -1;
    private dayTime = -1;
    private canSelect = false;

    ellipsisCorrection(x: number) {
        // with b=2: x-((-1+Math.sqrt(b))*Math.cos(x)*Math.sin(x))/(1+Math.sqrt(b))
        // inside f(x * 2 * Math.PI)
        return 2 * x * Math.PI + (-3 / 2 + Math.sqrt(2)) * Math.sin(4 * Math.PI * x);
    }

    setNight(isNight: boolean) {
        if (isNight) document.getElementsByTagName("body")[0].classList.add("night");
        else document.getElementsByTagName("body")[0].classList.remove("night");
    }

    showCurrentEvent() {
        switch (this.currentEvent) {
            case "AMOR":
                return this.self.role == "amor";
        }
        return false;
    }
    private currentEvent = "NONE";

    scheduleNextEvent() {
        this.currentEvent = "AMOR";
        this.canSelect = this.self.role == "amor";
        //this.currentEvent = "AMOR";
        //this.canSelect = this.self.role == "amor";
    }

    async confirmAmor(selectedPlayers: API.Player[]) {
        await API.event("AMOR", { id1: selectedPlayers[0].id, id2: selectedPlayers[1].id });
    }

    get selectedPlayers() {
        return this.players.filter(p => p.selected);
    }

    async mounted() {
        this.loading = true;
        const req = await API.getPlayers();
        this.players = req.players;
        this.self = req.self;
        this.loading = false;

        this.interval = setInterval(async () => {
            /*const req = await API.getGameState();
            this.players = req.players;
            this.self = req.self;
            this.currentEvent = req.currentEvent;
            this.dayTime = req.dayTime;
            this.voting = req.voting;*/
        }, 1000);
        this.scheduleNextEvent();

        setTimeout(() => this.setNight(true), 3000);
    }
    async destroyed() {
        clearInterval(this.interval);
    }

    async playerClicked(player: API.Player) {
        if (!this.canSelect) return;

        this.updatePlayer(player, { selected: !player.selected });
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
</style>
