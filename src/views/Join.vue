<template>
    <div v-if="!loading" class="d-flex align-content-center" style="height:100vh">
        <form class="form-signin" style="max-width:420px; margin:auto;width:100%">
            <div class="text-center mb-4">
                <img class="mb-4" src="@/assets/logo.png" alt="" width="144" height="144" />
                <h1 class="h3 mb-3 font-weight-normal">Werewolf</h1>
            </div>

            <div class="form-label-group my-4 ">
                <input v-model="name" type="text" class="form-control" placeholder="Name" autofocus />
            </div>

            <button class="btn btn-lg btn-primary btn-block" type="button" @click="start()">Continue</button>
            <p v-if="error" class="text-danger text-center">Something went wrong setting name.</p>

            <p class="mt-5 mb-3 text-muted text-center">&copy; Alexander Seidler 2020-2020</p>
        </form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { setName } from "../API";

@Component({})
export default class Join extends Vue {
    private loading = false;
    private name = "";
    private error = "";

    async start() {
        try {
            await setName(this.name);
            this.$router.push("/");
        } catch (e) {
            this.error = e;
            console.log(e.message);
        }
    }
}
</script>
<style scoped></style>
