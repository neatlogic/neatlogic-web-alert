<template>
  <div
    class="padding-sm"
    :class="{ 'bg-info-grey': !data.bgColor }"
    style="height: 100%; width: 100%; overflow: auto"
    :style="{
      borderRadius: data.radius + 'px',
      borderWidth: (data.borderWidth || 1) + 'px',
      background: data.bgColor,
      borderColor: data.borderColor,
      borderStyle: data.borderStyle
    }"
  >
  </div>
</template>
<script>
import base from '../../base.vue';
export default {
  name: 'VueRect',
  components: {
  },
  extends: base,
  props: {},
  data() {
    return {
    };
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
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.vue_rect_container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* 或其他任何高度 */
}
</style>
