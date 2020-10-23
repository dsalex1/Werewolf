<template>
    <div class="d-flex justify-content-center align-items-center flex-column" style="height:100vh">
        <div class="spinner-border" role="status"></div>
        <p v-if="!error" class="mt-3 text-muted text-center">Loading...</p>
        <p v-if="error" class="text-danger text-center">Something went wrong loading user data.</p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getUser } from "../API";

@Component({})
export default class Home extends Vue {
    private loading = true;
    private error = "";

    async mounted() {
        try {
            const user = await getUser();
            console.log({ user });
            if (user.state == "new") this.$router.push("/join");
            if (user.state == "creator") this.$router.push("/create");
            if (user.state == "player") this.$router.push("/play");
            if (user.state == "waiting") this.$router.push("/waiting");
        } catch (e) {
            this.error = e;
        }
    }
}
</script>
<style scoped></style>
