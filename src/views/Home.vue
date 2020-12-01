<template>
  <div>
    <scale-loader :loading="isLoading" :color="'#68d391'" :size="100" />
    <px-table v-if="!isLoading" :assets="assets" />
  </div>
</template>

<script>
import api from "@/api";
import PxTable from "@/components/PxTable";

export default {
  name: "Home",

  components: { PxTable },

  data() {
    return {
      isLoading: false,
      assets: []
    };
  },

  created() {
    this.isLoading = true;
    api
      .getAssets()
      .then(assets => (this.assets = assets))
      .finally(() => {
        this.isLoading = false;
      });
  }
};
</script>
