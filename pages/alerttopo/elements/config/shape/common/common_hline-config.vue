<template>
  <TsForm v-model="data" :item-list="form" :labelPosition="mode === 'widget' ? 'right' : 'top'">
    <template v-slot:borderWidth>
      <div class="pl-nm pr-nm"><Slider v-model="data.borderWidth" :min="1" :max="20"></Slider></div>
    </template>
    <template v-slot:borderColor>
      <ColorPicker
        :transfer="true"
        :value="data.borderColor"
        alpha
        recommend
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            $set(data, 'borderColor', val);
          }
        "
      />
    </template>
  </TsForm>
</template>
<script>
import { ConfigBase } from '@/commercial-module/diagram/pages/elements/config/config-base.js';
export default {
  name: '',
  components: {
  },
  extends: ConfigBase,
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
  methods: {
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
</style>
