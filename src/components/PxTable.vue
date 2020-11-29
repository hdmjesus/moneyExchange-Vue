<template>
  <article class="flex flex-col">
    <div
      class="grid grid-cols-custom-cripto text-xs border-b-2 justify-items-center gap-x-2 py-3"
    >
      <div class=" title__table-item"><p>Ranking</p></div>
      <div class="title__table-item"><p>Nombre</p></div>
      <div class="title__table-item"><p>Precio</p></div>
      <div class="title__table-item">
        <p class="text-center">Cap.de mercado</p>
      </div>
      <div class="title__table-item">
        <p class="text-center">Variacion 24 hrs</p>
      </div>
    </div>
    <div
      v-for="a in assets"
      :key="a.id"
      class="title__table-item grid grid-cols-custom-cripto gap-x-2 h-12 border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100 text-xs"
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
        <div
          class="align-middle whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <router-link
            class=" hover:underline hover:text-green-600"
            :to="{ name: 'coin-detail', params: { id: a.id } }"
          >
            {{ a.name }}
          </router-link>
          <small class="ml-1 text-gray-500">{{ a.symbol }}</small>
        </div>
      </div>
      <div>
        <p class="text-center">{{ a.priceUsd | dollar }}</p>
      </div>
      <div>
        <p class="text-center">{{ a.marketCapUsd | dollar }}</p>
      </div>
      <div>
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

  methods: {
    goToCoin(id) {
      this.$router.push({ name: "coin-detail", params: { id } });
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
