<template>
  <div>
    <span v-if="isClose === 1" class="text-success">{{ $t('page.yes') }}</span>
    <span v-else class="text-error">{{ $t('page.no') }}</span>
  </div>
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
    isClose() {
      if (this.mode !== 'audit') {
        return this.row.isClose;
      } else {
        if (this.value && this.value.length > 0) {
          return this.value[0];
        }
      }
      return null;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
