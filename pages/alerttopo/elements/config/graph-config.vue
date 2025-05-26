<template>
  <div>
    <TsFormItem label="背景颜色" labelPosition="top">
      <ColorPicker
        :transfer="true"
        recommend
        alpha
        :value="config.background && config.background.color"
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            setValue('background.color', val);
            graph.drawBackground({ color: val });
          }
        "
      />
    </TsFormItem>
  </div>
</template>
<script>
import { Graph } from '@antv/x6';
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    config: { type: Object },
    graph: { type: Graph }
  },
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
  methods: {
    setValue(attr, val) {
      if (!attr.includes('.')) {
        if (!this.config.attr) {
          this.$set(this.config, attr, val);
        }
      } else {
        const attrs = attr.split('.');
        let currentData = this.config;
        for (let i = 0; i < attrs.length - 1; i++) {
          const a = attrs[i];
          if (!currentData[a]) {
            this.$set(currentData, a, {});
          }
          currentData = currentData[a];
        }
        this.$set(currentData, attrs[attrs.length - 1], val);
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>
