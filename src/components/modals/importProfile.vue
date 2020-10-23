<template>
    <Modal title="Create data" ref="modal" @dismiss="reset">
        <template v-slot:button>
            <button type="button" class="btn btn-secondary ml-1"><i class="fas fa-file-import"></i> import</button>
        </template>

        <template v-slot:content>
            <div class="row">
                <div class="col-6">data</div>
                <div class="col-6">
                    <input class="form-control" v-model="data" />
                </div>
            </div>
        </template>

        <template v-slot:footer>
            <button @click="importProf" type="button" class="btn btn-primary ml-1"><i class="fas fa-file-import"></i> import</button>
            <div class="col text-danger" v-if="error">Coudn't create data</div>
        </template>
    </Modal>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import Modal from "./Modal.vue";

@Component
export default class Createdata extends Vue {
    @Prop() accountID!: number;
    private data = "";
    private error = false;

    private async importProf() {
        try {
            //const profile = API.importProfile(JSON.parse(this.data));
            //this.$emit("newProfile", profile);
            this.error = false;
            (this.$refs["modal"] as Modal).dismiss();
            this.reset();
        } catch (e) {
            console.error(e);
            this.error = true;
        }
    }

    private reset(): void {
        this.data = "";
    }
}
</script>
