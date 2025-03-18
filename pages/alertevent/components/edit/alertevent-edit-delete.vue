<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem :required="true" label="删除子告警" labelPosition="left">
      <TsFormSwitch
        v-model="configLocal.isDeleteChildAlert"
        :trueValue="1"
        :falseValue="0"
      ></TsFormSwitch>
      <div class="text-grey mt-md">是否同时删除所有子告警？</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
    };
  },
  beforeCreate() {},
  created() {
  },
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
<style lang="less"></style>
