<template>
  <div>
    <TsFormItem label="集成" labelPosition="right" :required="true">
      <TsFormSelect
        ref="integrationUuid"
        v-model="configLocal.integrationUuid"
        transfer
        dynamicUrl="/api/rest/integration/search"
        :params="{ isActive: 1 }"
        rootName="tbodyList"
        textName="name"
        valueName="uuid"
        border="border"
        :validateList="[{ name: 'required', message: ' ' }]"
        @on-change="getIntegrationByUuid"
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem v-if="integrationData && paramList.length > 0" label="参数映射" labelPosition="right">
      <div>
        <span class="cursor text-action" @click="isShowAttrList = !isShowAttrList">
          <span :class="isShowAttrList ? 'tsfont-drop-down' : 'tsfont-drop-right'"></span>
          <span class="ml-xs">点击复制属性</span>
        </span>
        <div class="text-grey mt-xs">{{ attrHelp }}</div>
        <div v-if="isShowAttrList" class="mt-sm attr-list">
          <Tag
            v-for="(attr, index) in attrList"
            :key="index"
            v-clipboard="attr.freemarkerSnippet || '${DATA.' + attr.name + '}'"
            v-clipboard:success="clipboardSuc"
            class="cursor"
            @click.stop
          >{{ attr.label }}</Tag>
        </div>
        <TsFormItem
          v-for="(param, index) in paramList"
          :key="index"
          labelPosition="top"
          :label="(param.description || param.name) + '(' + param.typeName + ')'"
        >
          <TsFormInput
            type="textarea"
            border="border"
            :value="getExpression(param.name)"
            @on-change="val => setExpression(param.name, val)"
          ></TsFormInput>
        </TsFormItem>
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import clipboard from '@/resources/directives/clipboard.js';
export default {
  name: '',
  directives: { clipboard },
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput')
  },
  props: {
    value: { type: Object, default: () => ({}) },
    trigger: { type: String, default: 'OPEN' }
  },
  data() {
    return {
      configLocal: {
        paramMapping: [],
        ...(this.value || {})
      },
      integrationData: null,
      attrList: [],
      isShowAttrList: false
    };
  },
  created() {
    if (!this.configLocal.paramMapping) {
      this.$set(this.configLocal, 'paramMapping', []);
    }
    if (this.configLocal.integrationUuid) {
      this.getIntegrationByUuid(this.configLocal.integrationUuid);
    }
    this.listAlertAttrList();
  },
  methods: {
    valid() {
      return this.$refs.integrationUuid && this.$refs.integrationUuid.valid();
    },
    getConfig() {
      if (this.configLocal.paramMapping && this.configLocal.paramMapping.length > 0) {
        for (let i = this.configLocal.paramMapping.length - 1; i >= 0; i--) {
          if (!this.paramList.find(d => d.name === this.configLocal.paramMapping[i].name)) {
            this.$delete(this.configLocal.paramMapping, i);
          }
        }
      }
      return this.configLocal;
    },
    getIntegrationByUuid(uuid) {
      this.integrationData = null;
      if (uuid) {
        this.$api.framework.integration.getIntegrationByUuid({ uuid: uuid }).then(res => {
          this.integrationData = res.Return;
        });
      }
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList(this.attrSearchParam).then(res => {
        this.attrList = res.Return || [];
      });
    },
    getExpression(name) {
      const item = this.configLocal.paramMapping.find(d => d.name === name);
      return item ? item.expression : '';
    },
    setExpression(name, val) {
      const index = this.configLocal.paramMapping.findIndex(d => d.name === name);
      const data = { name: name, expression: val };
      if (index > -1) {
        this.$set(this.configLocal.paramMapping, index, data);
      } else {
        this.configLocal.paramMapping.push(data);
      }
    },
    clipboardSuc() {
      this.$Message.success(this.$t('message.copysuccess'));
    }
  },
  computed: {
    isAggregateTrigger() {
      return this.trigger === 'AGGREGATE';
    },
    attrSearchParam() {
      return this.isAggregateTrigger ? { isAggregate: 1 } : { isExpand: 1 };
    },
    attrHelp() {
      return this.isAggregateTrigger
        ? '聚合时可使用聚合变量；若使用单个告警属性变量，默认取alertList中最后一个成员的值。'
        : '当前触发点不是聚合场景，不提供 ${DATA.alertList}、${DATA.alertCount}、${DATA.alertItemList}。';
    },
    paramList() {
      return (this.integrationData && this.integrationData?.config?.param?.paramList) || [];
    }
  },
  watch: {
    trigger() {
      this.listAlertAttrList();
    },
    configLocal: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    }
  }
};
</script>
