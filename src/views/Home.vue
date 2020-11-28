<template>
  <px-table v-bind:assets="assets"></px-table>
</template>

<script>
import PxTable from "@/components/PxTable";
import api from "@/api.js";

export default {
  name: "Home",
  components: { PxTable },
  data() {
    return {
      assets: []
    };
  },

  created() {
    api.getAssets().then(asset => (this.assets = asset));
  }
};
</script>
