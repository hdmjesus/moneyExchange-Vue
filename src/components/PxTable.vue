<template>
  <article class="flex flex-col">
    <div
      class="grid grid-cols-table-titleMobile md:grid-cols-custom-cripto text-xs sm:text-sm ig:text-base border-b-2 justify-items-center gap-x-2 py-3"
    >
      <div
        class="flex justify-items-center"
        :class="{ up: this.sortOrder == 1, down: this.sortOrder == -1 }"
      >
        <span
          v-on:click="changeSortOrder"
          class=" title__table-item underline cursor-pointer "
        >
          Rank
        </span>
      </div>
      <div class="title__table-item"><p>Nombre</p></div>
      <div class="title__table-item"><p>Precio</p></div>
      <div class=" hidden md:flex title__table-item">
        <p class="text-center">Cap.de mercado</p>
      </div>
      <div class=" title__table-item hidden md:flex ">
        <p class="text-center">Variacion 24 hrs</p>
      </div>
      <div class="hidden sm:block">
        <input
          class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
          id="filter"
          placeholder="Buscar..."
          type="text"
          v-model="filter"
        />
      </div>
    </div>
    <div
      v-for="a in filteredAssets"
      :key="a.id"
      class="title__table-item grid  grid-cols-table-titleMobile md:grid-cols-custom-cripto gap-x-2 h-12 border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100 text-xs sm:text-sm ig:text-base"
    >
      <div class="flex justify-center">
        <b># {{ a.rank }}</b>
      </div>

      <div class=" flex items-center">
        <img
          class="w-5 h-5 mr-2 inline-block"
          :src="
            `https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`
          "
          :alt="a.name"
        />
        <div class="align-middle ">
          <router-link
            class=" hover:underline hover:text-green-600"
            :to="{ name: 'coin-detail', params: { id: a.id } }"
          >
            <span class="whitespace-nowrap overflow-hidden overflow-ellipsis">{{
              a.name
            }}</span>
          </router-link>
          <small class=" hidden  xl:block ml-1 text-gray-500">{{
            a.symbol
          }}</small>
        </div>
      </div>
      <div>
        <p class="text-center">{{ a.priceUsd | dollar }}</p>
      </div>
      <div class="hidden md:block">
        <p class="text-center">{{ a.marketCapUsd | dollar }}</p>
      </div>
      <div class="hidden md:block">
        <p
          :class="
            a.changePercent24Hr.includes('-')
              ? 'text-red-600'
              : 'text-green-600'
          "
          class="text-center"
        >
          {{ a.changePercent24Hr | percent }}
        </p>
      </div>

      <div>
        <px-button @click-custom="goToCoin(a.id)"
          ><span>Detalles</span></px-button
        >
      </div>
    </div>
  </article>
</template>

<script>
import PxButton from "@/components/PxButton";

export default {
  components: { PxButton },
  name: "PxTable",

  props: {
    assets: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return { filter: "", sortOrder: 1, mobileFirst: false };
  },
  computed: {
    filteredAssets() {
      const altOrder = this.sortOrder == 1 ? -1 : 1;

      return this.assets
        .filter(
          a =>
            a.symbol.toLowerCase().includes(this.filter.toLowerCase()) ||
            a.name.toLowerCase().includes(this.filter.toLowerCase())
        )
        .sort((a, b) => {
          if (parseInt(a.rank) > parseInt(b.rank)) {
            return this.sortOrder;
          }

          return altOrder;
        });
    }
  },

  methods: {
    goToCoin(id) {
      this.$router.push({ name: "coin-detail", params: { id } });
    },
    changeSortOrder() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    }
  }
};
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}
</style>
