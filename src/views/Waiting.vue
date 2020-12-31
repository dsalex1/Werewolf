<template>
    <div class="row pt-3">
        <div class="col-8">
            <div class="card ">
                <div class="card-header">Cards</div>
                <div class="card-body">
                    <h5 class="card-title text-right">Total: {{ Object.values(creation.cards).reduce((a, c) => a + c, 0) }}</h5>
                    <div class="row my-n2">
                        <div class="col-4 my-2" v-for="card in ['werewolf', 'villager', 'amor', 'seer', 'witch']" :key="card">
                            <div class="card text-center">
                                <div class="card-header">
                                    <span class="mx-2" style="font-size:20px">{{ creation.cards[card] }}</span>
                                </div>
                                <img class="card-img-top" :src="require('../assets/' + card + '.jpg')" style="border-radius:5px" />
                                <div class="card-footer vertical-align-center">{{ card }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card">
                <div class="card-header">Players</div>
                <div class="card-body">
                    <h5 class="card-title">Total: {{ creation.players.length }}</h5>
                    <table class="table table-striped">
                        <tbody>
                            <tr v-for="player in creation.players" :key="player.id">
                                <td>{{ player.name }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-content-center align-items-center flex-column">
                        <div class="spinner-border" role="status"></div>
                        <p class="mt-3 text-muted text-center">Waiting for creator <br />to start the game</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import * as API from "../API";

@Component({})
export default class Waiting extends Vue {
    private creation: API.GameCreation = { cards: {} as any, players: [], started: false };
    private interval = -1;
    private user: API.User = null!;

    @Watch("creation", { deep: true })
    onCreationChanged(creation: API.GameCreation) {
        if (creation.started) this.$router.push("play");
    }
    @Watch("user", { deep: true })
    onUserChanged() {
        console.log(this.user, "it changed");
        if (this.user.state == "creator") this.$router.push("/create");
        if (this.user.state == "new") this.$router.push("/");
    }
    async mounted() {
        this.user = await API.getUser();
        this.creation = await API.getGameCreation();
        this.interval = setInterval(async () => {
            this.creation = await API.getGameCreation();
            this.user = await API.getUser();
            console.log(this.user.state);
        }, 1000);
    }
    async destroyed() {
        clearInterval(this.interval);
    }
}
</script>
<style scoped></style>
