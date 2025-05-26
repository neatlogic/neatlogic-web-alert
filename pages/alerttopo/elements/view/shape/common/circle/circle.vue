<template>
  <div
    class="container overflow cursor"
    :class="{ 'bg-info-grey': !data.bgColor }"
    style="height: 100%; width: 100%; border-radius: 50%"
    :style="{
      borderWidth: (data.borderWidth || 1) + 'px',
      background: data.bgColor,
      borderColor: data.borderColor,
      borderStyle: data.borderStyle
    }"
  ><span :style="{ color: data.fontColor }">{{ data.ciEntityName || '' }}</span></div>
</template>
<script>
import base from '../../base.vue';
export default {
  name: 'VueCircle',
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
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* 或其他任何高度 */
}</style>
