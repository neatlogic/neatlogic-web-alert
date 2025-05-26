<template>
  <div
    style="width: 100%; height: 100%; overflow: hidden; text-overflow: ellipsis;text-align:center"
    :style="{
      'font-weight': data.isBold ? 'bold' : 'normal',
      color: data.color,
      'font-size': data.fontSize + 'px'
    }"
  >
    {{ data.text }}
  </div>
</template>
<script>
import base from '../../base.vue';
export default {
  name: '',
  components: {},
  extends: base,
  props: {},
  data() {
    return {
      text: ''
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
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>
