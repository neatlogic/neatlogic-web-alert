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
    <TsFormItem :label="$t('term.alert.targetstatus')" labelPosition="left" :required="true">
      <TsFormSelect
        ref="status"
        v-model="configLocal.status"
        :dataList="statusList"
        valueName="name"
        textName="label"
        :validateList="[{ name: 'required', message: ' ' }]"
        :transfer="true"
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
    return {
      attrList: [],
      statusList: []
    };
  },
  beforeCreate() {},
  created() {
    if (this.$utils.isEmpty(this.configLocal)) {
      this.configLocal = { uniqueAttrList: [], ruleList: [] };
    }
    this.listAllStatus();
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
      let isValid = true;
      const status = this.$refs.status;
      if (!status || !status.valid()) {
        isValid = false;
      }
      return isValid;
    },
    listAllStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
