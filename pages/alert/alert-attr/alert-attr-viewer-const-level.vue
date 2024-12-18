<template>
  <div v-if="row.alertLevel">
    <div :style="{ color: row.alertLevel.color }">{{ row.alertLevel.label }}</div>
  </div>
</template>
<script>
import { AttrViewerBase } from '@/commercial-module/alert/pages/alert/alert-attr/alert-attr-viewer-base.js';

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
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
