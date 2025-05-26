<template>
  <TsForm v-model="data" :item-list="form" :labelPosition="mode === 'widget' ? 'right' : 'top'">
    <template v-slot:fontColor>
      <ColorPicker
        :transfer="true"
        :value="data.fontColor"
        alpha
        recommend
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            $set(data, 'fontColor', val);
          }
        "
      />
    </template>
    <template v-slot:iconColor>
      <ColorPicker
        :transfer="true"
        :value="data.iconColor"
        alpha
        recommend
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            $set(data, 'iconColor', val);
          }
        "
      />
    </template>
    <template v-slot:iconSize>
      <div class="pl-nm pr-nm"><Slider v-model="data.iconSize" :min="20" :max="50"></Slider></div>
    </template>
    <template v-slot:fontSize>
      <div class="pl-nm pr-nm"><Slider v-model="data.fontSize" :min="12" :max="30"></Slider></div>
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
