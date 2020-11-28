<template>
  <div class="flex-col">
    <template>
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <!-- <img
            class="w-20 h-20 mr-5"
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            :alt="asset.name"
          /> -->
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
              <span>{{ min }}</span>
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
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Cambiar
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl"></span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from "@/api.js";
export default {
  name: "CoinDetail",

  data() {
    return {
      asset: {},
      history: []
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
    }
  },
  created() {
    this.getCoin();
  },

  methods: {
    getCoin() {
      const id = this.$route.params.id;
      api.getAsset(id).then(asset => {
        this.asset = asset;
      });

      api.getAssetHistory(id).then(history => {
        this.history = history;
      });
    }
  }
};
</script>