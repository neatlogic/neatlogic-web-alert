<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <TsFormItem
      v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0"
      style="margin: 0px !important"
      :label="$t('term.alert.uniquekey')"
      labelPosition="left"
    >
      <div>
        <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0 && configLocal.ruleList && configLocal.ruleList.length > 0"
      style="margin: 0px !important"
      :label="$t('term.alert.alertsign')"
      labelPosition="left"
    >
      <TsFormSelect
        :value="configLocal.ruleList"
        url="/api/rest/alert/rule/list"
        :params="{ isActive: 1 }"
        transfer
        border="border"
        valueName="id"
        textName="label"
        multiple
        readonly
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.defaultStatus"
      style="margin: 0px !important"
      :label="$t('term.alert.defaultstatus')"
      labelPosition="left"
    >
      <div v-if="statusData">
        <Badge :color="statusData.color" :text="statusData.label"></Badge>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.serialSave"
      style="margin: 0px !important"
      :label="$t('term.alert.serialsave')"
      labelPosition="left"
    ><span class="text-success">{{ $t('page.yes') }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.status"
      style="margin: 0px !important"
      :label="$t('term.alert.dealresult')"
      labelPosition="left"
    >
      <div>
        <span
          :class="{
            'text-success': handler.status === 'succeed',
            'text-error': handler.status === 'failed'
          }"
        >
          {{ handler.statusName }}
        </span>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result && handler.result.uniqueKeyOriginal"
      style="margin: 0px !important"
      labelPosition="left"
      label="唯一键原值"
    >
      <div class="text-word-break">{{ handler.result.uniqueKeyOriginal }}</div>
    </TsFormItem>
    <TsFormItem
      v-if="finalUniqueKey"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('term.alert.uniquekey')"
    >
      <div class="text-word-break">{{ finalUniqueKey }}</div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result && handler.result.alertId"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('term.alert.createalert')"
    >
      <span class="text-href" @click="showAlert(handler.result.alertId)">{{ handler.result.alertTitle }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result && handler.result.fromAlertId"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('term.alert.joinalert')"
    >
      <span class="text-href" @click="showAlert(handler.result.fromAlertId)">{{ handler.result.fromAlertTitle }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.error"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('page.exception')"
    >
      <div class="text-error">{{ handler.error }}</div>
    </TsFormItem>
    <AlertView v-if="isShowAlert" :id="currentAlertId" @close="isShowAlert = false"></AlertView>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue'),
    AlertView: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-dialog.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      isShowAlert: false,
      currentAlertId: null,
      statusData: null
    };
  },
  beforeCreate() {},
  created() {
    if (this.configLocal.defaultStatus) {
      this.getAlertStatus(this.configLocal.defaultStatus);
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
    getAlertStatus(status) {
      this.$api.alert.status.getAlertStatusByName(status).then(res => {
        this.statusData = res.Return;
      });
    },
    showAlert(alertId) {
      this.isShowAlert = true;
      this.currentAlertId = alertId;
    }
  },
  filter: {},
  computed: {
    finalUniqueKey() {
      if (this.handler && this.handler.result && this.handler.result.uniqueKey) {
        return this.handler.result.uniqueKey;
      }
      return this.handler ? this.handler.uniqueKey : null;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
