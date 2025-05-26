<template>
  <div style="height: 100%; width: 100%" class="vue_lane_table">
    <div class="vue_lane_row">
      <div
        v-for="(lane, index) in data.lanes"
        :key="index"
        class="vue_lane_cell"
        :style="{
          borderWidth: (lane.borderWidth || 1) + 'px',
          borderColor: lane.borderColor,
          borderStyle: lane.borderStyle,
          background: lane.bgColor
        }"
      >
        <div class="overflow lane_text padding-xs" :style="{ background: lane.nameBgColor, color: lane.nameFontColor }">{{ lane.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import base from '../../base.vue';
export default {
  name: 'VueLane',
  components: {},
  extends: base,
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
.vue_lane_table {
  display: table;
  border-collapse: collapse;
}
.vue_lane_row {
  display: table-row;
}
.vue_lane_cell {
  display: table-cell;
  position: relative;
  height: 100%;
}
.lane_text {
  position: absolute;
  text-align: center;
  top: 0px;
  left: 0px;
  width: 100%;
}
</style>
