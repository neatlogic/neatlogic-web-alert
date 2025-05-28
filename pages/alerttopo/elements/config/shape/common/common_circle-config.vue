<template>
  <TsForm v-model="data" :item-list="form" :labelPosition="mode === 'widget' ? 'right' : 'top'">
    <template v-slot:borderWidth>
      <div class="pl-nm pr-nm"><Slider v-model="data.borderWidth" :min="1" :max="20"></Slider></div>
    </template>
    <template v-slot:fontSize>
      <div class="pl-nm pr-nm"><Slider v-model="data.fontSize" :min="12" :max="20"></Slider></div>
    </template>
    <template v-slot:radius>
      <div class="pl-nm pr-nm"><Slider v-model="data.radius" :min="0" :max="20"></Slider></div>
    </template>
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
    <template v-slot:bgColor>
      <ColorPicker
        :transfer="true"
        :value="data.bgColor"
        alpha
        recommend
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            $set(data, 'bgColor', val);
          }
        "
      />
    </template>
  </TsForm>
</template>
<script>
import { ConfigBase } from '@/community-module/alert/pages/alerttopo/elements/config/config-base.js';
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
