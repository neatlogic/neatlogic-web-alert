<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="集成" labelPosition="left" :required="true">
      <TsFormSelect
        ref="integraionUuid"
        v-model="configLocal.integrationUuid"
        transfer
        dynamicUrl="/api/rest/integration/search"
        :params="{ isActive: 1 }"
        rootName="tbodyList"
        textName="name"
        valueName="uuid"
        border="border"
        :validateList="[{ name: 'required', message: ' ' }]"
        @on-change="
          val => {
            getIntegrationByUuid(val);
          }
        "
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem v-if="integrationData && paramList.length > 0" label="参数映射" labelPosition="left">
      <div>
        <div>
          <span class="mr-xs text-grey">点击复制属性</span>
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
            @on-change="
              val => {
                const index = configLocal.paramMapping.findIndex(d => d.name === param.name);
                const data = { name: param.name, expression: val };
                if (index > -1) {
                  $set(configLocal.paramMapping, index, data);
                } else {
                  configLocal.paramMapping.push(data);
                }
              }
            "
          ></TsFormInput>
        </TsFormItem>
      </div>
    </TsFormItem>
    <TsFormItem label="调用间隔" labelPosition="left">
      <TsFormInput
        v-model="configLocal.interval"
        type="number"
        :min="1"
        :step="1"
        border="border"
      ></TsFormInput>
      <div class="text-grey">帮助：在调用间隔时间（?分钟）内只会调用一次</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
import clipboard from '@/resources/directives/clipboard.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput')
  },
  directives: { clipboard },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      integrationData: null,
      attrList: []
    };
  },
  beforeCreate() {},
  created() {
    if (!this.configLocal.paramMapping) {
      this.$set(this.configLocal, 'paramMapping', []);
    }
    if (this.configLocal.integrationUuid) {
      this.getIntegrationByUuid(this.configLocal.integrationUuid);
    }
    this.listAlertAttrList();
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
      const integraionUuid = this.$refs.integraionUuid;
      if (!integraionUuid || !integraionUuid.valid()) {
        isValid = false;
      }
      return isValid;
    },
    clipboardSuc() {
      this.$Message.success(this.$t('message.copysuccess'));
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList({ isExpand: 1 }).then(res => {
        this.attrList = res.Return;
      });
    },
    getIntegrationByUuid(uuid) {
      this.integrationData = null;
      if (uuid) {
        this.$api.framework.integration.getIntegrationByUuid({ uuid: uuid }).then(res => {
          this.integrationData = res.Return;
        });
      }
    },
    getExpression(name) {
      const item = this.configLocal.paramMapping.find(d => d.name === name);
      return item ? item.expression : '';
    }
  },
  filter: {},
  computed: {
    paramList() {
      return (this.integrationData && this.integrationData?.config?.param?.paramList) || [];
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped></style>
