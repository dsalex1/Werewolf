<template>
    <v-touch @swipeup="flipped = !flipped" @swipedown="flipped = !flipped" class="flipper">
        <div v-bind:class="flipped ? 'flip-container flipped' : 'flip-container'">
            <div class="front">
                <slot name="front"></slot>
            </div>
            <div class="back">
                <slot name="back"></slot>
            </div>
        </div>
    </v-touch>
</template>

<script>
export default {
    name: "FlipCard",
    data: function() {
        return {
            flipped: false
        };
    }
};
</script>

<style type="text/css" scoped>
i.frontFlipBtn,
i.backFlipBtn {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #ffffff;
}
i.backFlipBtn {
    -webkit-transform: rotateX(-180deg);
    -moz-transform: rotateX(-180deg);
    -o-transform: rotateX(-180deg);
    -ms-transform: rotateX(-180deg);
    transform: rotateX(-180deg);
}
.flip-container {
    -webkit-perspective: 1000;
    -moz-perspective: 1000;
    -o-perspective: 1000;
    perspective: 1000;
}
.flip-container {
    min-height: 120px;
}
.flipper {
    -moz-transform: perspective(1000px);
    -moz-transform-style: preserve-3d;
    position: relative;
}
.front,
.back {
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transition: 0.3s;
    -webkit-transform-style: preserve-3d;
    -moz-transition: 0.3s;
    -moz-transform-style: preserve-3d;
    -o-transition: 0.3s;
    -o-transform-style: preserve-3d;
    -ms-transition: 0.3s;
    -ms-transform-style: preserve-3d;
    transition: 0.3s;
    transform-style: preserve-3d;
    top: 0;
    left: 0;
    width: 100%;
}
.back {
    -webkit-transform: rotateX(-180deg);
    -moz-transform: rotateX(-180deg);
    -o-transform: rotateX(-180deg);
    -ms-transform: rotateX(-180deg);
    transform: rotateX(-180deg);
    position: absolute;
}
.flip-container.flipped .back {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -o-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    transform: rotateX(0deg);
}
.flip-container.flipped .front {
    -webkit-transform: rotateX(180deg);
    -moz-transform: rotateX(180deg);
    -o-transform: rotateX(180deg);
    -ms-transform: rotateX(180deg);
    transform: rotateX(180deg);
}
.front {
    z-index: 2;
}
</style>
