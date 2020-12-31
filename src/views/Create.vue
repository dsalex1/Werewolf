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
                                    <button
                                        @click="creation.cards[card] > 0 && creation.cards[card]--"
                                        class="btn btn-danger btn-large"
                                        style="width:2.5rem;"
                                    >
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="mx-2" style="font-size:20px">{{ creation.cards[card] }}</span>
                                    <button @click="creation.cards[card]++" class="btn btn-success btn-large"><i class="fas fa-plus"></i></button>
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
                                <td>
                                    <span>{{ player.name }}</span>
                                    <button @click="kick(player.id)" class="btn btn-danger float-right"><i class="fas fa-user-times"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="#" @click="startGame()" class="btn btn-primary" :class="{ disabled: creation.players.length != totalCards }"
                        >Start Game</a
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import * as API from "../API";

@Component({})
export default class Create extends Vue {
    private creation: API.GameCreation = { cards: { werewolf: 0, villager: 0, amor: 0, seer: 0, witch: 0 }, players: [], started: false };
    private interval = -1;
    private user!: API.User;

    @Watch("creation", { deep: true })
    onCreationChanged(creation: API.GameCreation) {
        API.setGameCreation(creation);
    }

    @Watch("user", { deep: true })
    onUserChanged() {
        if (this.user.state == "waiting") this.$router.push("/waiting");
        if (this.user.state == "new") this.$router.push("/");
    }
    async mounted() {
        this.user = await API.getUser();
        this.creation = await API.getGameCreation();
        this.interval = setInterval(async () => {
            this.creation.players = (await API.getGameCreation()).players;
            this.user = await API.getUser();
        }, 1000);
    }
    async destroyed() {
        clearInterval(this.interval);
    }
    get totalCards() {
        return Object.values(this.creation.cards).reduce((a, c) => a + c, 0);
    }
    async startGame() {
        API.setGameCreation({ ...this.creation, started: true });
        this.$router.push("play");
    }
    async kick(id: string) {
        await API.kickUser(id);
        if (this.user.id == id) (location as any).reload();
    }
}
</script>
<style scoped></style>
