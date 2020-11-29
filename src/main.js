import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/tailwind.css";
import router from "@/router";
import { dollarFilter, percentFilter } from "@/filter";
import { VueSpinners } from "@saeris/vue-spinners";
import Chartkick from "vue-chartkick";
import Chart from "chart.js";

Vue.use(VueSpinners);
Vue.use(Chartkick.use(Chart));

Vue.config.productionTip = false;
Vue.filter("dollar", dollarFilter);
Vue.filter("percent", percentFilter);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
