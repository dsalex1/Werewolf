<template>
  <div>
    <div @click="show()">
      <slot name="button"></slot>
    </div>
    <!-- Modal-->
    <transition
      @enter="startTransitionModal"
      @after-enter="endTransitionModal"
      @before-leave="endTransitionModal"
      @after-leave="startTransitionModal"
    >
      <div class="modal fade" v-if="showModal" ref="modal">
        <div class="modal-dialog" role="document" @click.stop=";">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
              <button class="close" type="button" @click="dismissed">
                <span aria-hidden="true">
                  <i class="fas fa-times"></i>
                </span>
              </button>
            </div>
            <div class="modal-body">
              <slot name="content"></slot>
            </div>
            <div class="modal-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="modal-backdrop fade d-none" ref="backdrop" @click="dismissed"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Modal extends Vue {
  @Prop(String) readonly title!: string;

  private showModal = false;

  public show() {
    this.showModal = true;
  }
  public dismiss() {
    this.showModal = false;
  }

  private startTransitionModal() {
    (this.$refs.backdrop as any)?.classList?.toggle("d-block");
    (this.$refs.modal as any)?.classList?.toggle("d-block");
  }
  private endTransitionModal() {
    (this.$refs.backdrop as any)?.classList?.toggle("show");
    (this.$refs.modal as any)?.classList?.toggle("show");
  }

  private dismissed(): void {
    this.dismiss();
    this.$emit("dismiss");
  }
}
</script>