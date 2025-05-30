<template>
  <div v-if="mode !== 'audit' && row.alertLevel">
    <Badge class-name="level" :style="{ '--color': row.alertLevel.color }" :text="row.alertLevel.label"></Badge>
  </div>
  <div v-else-if="mode === 'audit' && levelData">
    <Badge class-name="level" :style="{ '--color': levelData.color }" :text="levelData.label"></Badge>
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
    return {
      levelData: null
    };
  },
  beforeCreate() {},
  created() {
    if (this.mode === 'audit' && this.value && this.value.length > 0 && this.value[0]) {
      this.$api.alert.alertlevel.getAlertLevelByLevel(this.value[0]).then(res => {
        this.levelData = res.Return;
      });
    }
  },
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
::v-deep .level {
  background: var(--color) !important;
}
</style>
