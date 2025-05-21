<template>
  <div v-if="valueList.length > 0">
    <span v-for="(v, index) in valueList" :key="index" class="mr-xs">{{ v }}</span>
  </div>
  <div v-else class="text-grey">-</div>
</template>
<script>
import { AttrViewerBase } from '@/commercial-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  components: {},
  extends: AttrViewerBase,
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
  filter: {},
  computed: {
    valueList() {
      if (this.value instanceof Array) {
        return this.value;
      } else if (this.value !== null && this.value !== undefined && this.value !== '') {
        return [this.value];
      }
      return [];
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
