<template>
  <div>
    <Badge
      v-if="row.alertLevel"
      class-name="level"
      :style="{ '--color': row.alertLevel.color }"
      :text="row.alertLevel.label"
    ></Badge>
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
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.level {
  background: var(--color);
}
</style>
