import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Join from "../views/Join.vue";
import Create from "../views/Create.vue";
import Waiting from "../views/Waiting.vue";
import Play from "../views/Play.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/join",
        name: "Join",
        component: Join
    },
    {
        path: "/create",
        name: "Create",
        component: Create
    },
    {
        path: "/waiting",
        name: "Waiting",
        component: Waiting
    },
    {
        path: "/play",
        name: "Play",
        component: Play
    }
];

const router = new VueRouter({
    routes,
    mode: "abstract"
});

export default router;
