import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import axios from "axios";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import VueTouch from "vue-touch";
import "bootstrap/dist/css/bootstrap.css";

import fitText from "./components/FitText.vue";
import { getItemOrElse } from "./API";

Vue.component("fit-text", fitText);
Vue.use(VueTouch, { name: "v-touch" });

Vue.config.productionTip = false;
// Load other components
const requireComponent = (require as any).context(
    // The relative path of the components folder
    "./components",
    // Whether or not to look in subfolders
    true,
    // The regular expression used to match base component filenames
    /.+\.(vue|js|ts)$$/
);
requireComponent.keys().forEach((fileName: any) => {
    // Get component config
    const componentConfig = requireComponent(fileName);

    // Get PascalCase name of component
    const componentName = upperFirst(
        camelCase(
            // Gets the file name regardless of folder depth
            fileName
                .split("/")
                .pop()
                .replace(/\.\w+$/, "")
        )
    );
    // Register component globally
    Vue.component(
        componentName,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
    );
});

declare module "vue/types/vue" {
    //  Declare augmentation for Vue
    interface Vue {
        choose: <T>(n: number, arr: Array<T>) => Array<T>;
    }
}

Vue.prototype.choose = <T>(n: number, arr: Array<T>) => {
    if (arr.length < n) return [...arr];
    const choosen: T[] = [];
    const choosenIds: number[] = [];
    while (choosen.length < n) {
        const idx = Math.floor(Math.random() * arr.length);
        if (!choosenIds.some(id => id == idx)) {
            choosen.push(arr[idx]);
            choosenIds.push(idx);
        }
    }
    return choosen;
};

axios.defaults.headers.common["Authorization"] = getItemOrElse("userIdentifier", (Math.random() + "").slice(2));

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
router.replace("/");
