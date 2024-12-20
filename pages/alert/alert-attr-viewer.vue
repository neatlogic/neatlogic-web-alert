<template>
  <div v-if="attr.kind === 'const' && handlers[attr.name]">
    <component
      :is="handlers[attr.name]"
      :row="row"
      :value="value"
      :mode="mode"
      :view="view"
      :attr="attr"
      @toggleChildren="toggleChildren"
    ></component>
  </div>
  <div v-else-if="attr.kind === 'attr' && handlers['attr_' + attr.type]">
    <component
      :is="handlers['attr_' + attr.type]"
      :row="row"
      :mode="mode"
      :view="view"
      :value="value"
      :attr="attr"
    ></component>
  </div>
  <div v-else>{{ value }}</div>
</template>
<script>
import * as handlers from '@/commercial-module/alert/pages/alert/alert-attr/index.js';
export default {
  name: '',
  components: {
    ...handlers
  },
  props: {
    row: { type: Object }, //完整数据行
    type: { type: String }, //const或attr
    attr: { type: Object },
    view: { type: Object }, //视图
    mode: { type: String }, //detail|list
    value: { type: [String, Number, Object, Array] }
  },
  data() {
    return {
      handlers: handlers
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
  methods: {
    toggleChildren() {
      this.$emit('toggleChildren', ...arguments);
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
