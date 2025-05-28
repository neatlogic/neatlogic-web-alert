<template>
  <div v-if="hasValue">
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
    hasValue() {
      if (this.value && this.value.length > 0) {
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i] !== null && this.value[i] !== undefined && this.value[i] !== '') {
            return true;
          }
        }
      }
      return false;
    },
    valueList() {
      if (this.value instanceof Array) {
        return this.value;
      } else if (this.hasValue) {
        return [this.value];
      }
      return [];
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
