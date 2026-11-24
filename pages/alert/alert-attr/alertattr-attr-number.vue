<template>
  <div v-if="valueList.length">
    <span v-for="(v, index) in valueList" :key="index" class="mr-xs">{{ v }}</span>
  </div>
  <div v-else class="text-grey">-</div>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';

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
      const values = Array.isArray(this.value) ? this.value : [this.value];
      return values.filter(value => value != null && value !== '');
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
