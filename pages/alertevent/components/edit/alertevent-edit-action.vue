<template>
  <div
    class="radius-md"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <EditBase :handler="handler"></EditBase>
    <TsFormItem :label="$t('page.action')" :required="true" labelPosition="left">
      <TsFormSelect
        ref="select"
        v-model="configLocal.actionList"
        :validateList="[{ name: 'required', message: ' ' }]"
        dynamicUrl="/api/rest/alert/action/search"
        transfer
        :search="true"
        valueName="name"
        :multiple="true"
        textName="label"
        border="border"
      ></TsFormSelect>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {
    if (!this.configLocal.actionList) {
      this.$set(this.configLocal, 'actionList', []);
    }
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
    async valid() {
      if (this.$refs.select && this.$refs.select.valid()) {
        return true;
      }
      return false;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
