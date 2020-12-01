<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <scale-loader
        :loading="isLoading"
        :color="'#68d391'"
        :size="100"
        :height="60"
      />
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col  xl:flex-row  justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            class="w-20 h-20 mr-5"
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            :alt="asset.name"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500"> {{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Rank</b>
              <span>{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span
                :class="
                  asset.changePercent24Hr.includes('-')
                    ? 'text-red-600'
                    : 'text-green-600'
                "
                >{{ asset.changePercent24Hr | percent }}</span
              >
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            v-on:click="toggleConverte"
            class="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `De USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                :placeholder="`Valor en ${fromUsd ? `USD` : asset.symbol}`"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl"
            >{{ convertResult }} {{ fromUsd ? asset.symbol : `USD` }}</span
          >
        </div>
      </div>
      <line-chart
        class="my-10"
        :color="['orange']"
        :min="min"
        :max="max"
        :data="history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />
      <h3 class="text-lg my-10">Mejores Ofertas de Cambio</h3>
      <table class="text-sm">
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}`"
          class="border-b text-center"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ m.priceUsd | dollar }}</td>
          <td class="hidden">{{ m.baseSymbol }}</td>
          <td class="overflow-hidden">
            <px-button
              :is-loading="m.isLoading || false"
              v-if="!m.url"
              v-on:click-custom="getWebSite(m)"
            >
              <slop v-show="!m.isLoading">Obtener Link</slop></px-button
            >
            <a
              :href="m.url"
              v-else
              class=" block w-24 overflow-hidden overflow-ellipsis m-auto hover:underline text-green-600"
              target="_blanck"
              >{{ m.url }}</a
            >
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/api.js";
import PxButton from "@/components/PxButton";
export default {
  name: "CoinDetail",

  components: { PxButton },
  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null,
      isLoading: false
    };
  },

  computed: {
    fixedHistory() {
      return this.history.map(h => parseFloat(h.priceUsd).toFixed(2));
    },

    sum() {
      return this.fixedHistory.reduce(
        (a, b) => parseFloat(a) + parseFloat(b),
        0.0
      );
    },

    min() {
      return Math.min(...this.fixedHistory);
    },

    max() {
      return Math.max(...this.fixedHistory);
    },

    avg() {
      return this.sum / this.fixedHistory.length || 0;
    },
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;
      return result.toFixed(3);
    }
  },
  created() {
    this.getCoin();
  },
  watch: {
    $route() {
      this.getCoin();
    }
  },

  methods: {
    getWebSite(exchange) {
      this.$set(exchange, "isLoading", true);

      return api
        .getExchanges(exchange.exchangeId)
        .then(res => {
          this.$set(exchange, "url", res.exchangeUrl);
        })
        .finally(() => {
          this.$set(exchange, "isLoading", true);
        });
    },
    getCoin() {
      const id = this.$route.params.id;
      this.isLoading = true;

      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id)
      ])
        .then(([asset, history, market]) => {
          this.asset = asset;
          this.history = history;
          this.markets = market;
        })
        .finally(() => {
          this.isLoading = false;
        });

      // api.getAsset(id).then(asset => {
      //   this.asset = asset;
      // });

      // api.getAssetHistory(id).then(history => {
      //   this.history = history;
      // });
    },
    toggleConverte() {
      this.fromUsd = !this.fromUsd;
    }
  }
};
</script>

<style scoped>
td {
  padding: 10px;
}
</style>
