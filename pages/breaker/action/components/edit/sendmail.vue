<template>
  <div>
    <TsFormItem label="邮件服务器" labelPosition="right">
      <TsFormSelect
        v-model="configLocal.mailServerId"
        url="/api/rest/mailserver/list"
        transfer
        rootName="tbodyList"
        valueName="id"
        textName="name"
        border="border"
      ></TsFormSelect>
      <div class="text-grey">帮助：不选择代表使用默认的邮件服务器</div>
    </TsFormItem>
    <TsFormItem :required="true" labelPosition="right" label="收件人">
      <UserSelect
        ref="sltToUser"
        v-model="configLocal.toUserList"
        :validateList="[{ name: 'required', message: ' ' }]"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user', 'team']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem labelPosition="right" label="抄送人">
      <UserSelect
        v-model="configLocal.ccUserList"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user', 'team']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem label="可复制属性" labelPosition="right">
      <div>
        <span class="cursor text-action" @click="isShowAttrList = !isShowAttrList">
          <span :class="isShowAttrList ? 'tsfont-drop-down' : 'tsfont-drop-right'"></span>
          <span class="ml-xs">点击复制属性</span>
        </span>
        <div class="text-grey mt-xs">{{ attrHelp }}</div>
        <div v-if="isShowAttrList" class="mt-sm">
          <Tag
            v-for="(attr, index) in attrList"
            :key="index"
            v-clipboard="attr.freemarkerSnippet || '${DATA.' + attr.name + '}'"
            v-clipboard:success="clipboardSuc"
            class="cursor"
            @click.stop
          >{{ attr.label }}</Tag>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem label="邮件标题" labelPosition="right" :required="true">
      <TsFormInput
        ref="txtTitle"
        v-model="configLocal.title"
        type="textarea"
        :maxlength="500"
        :validateList="[{ name: 'required', message: ' ' }]"
        border="border"
      ></TsFormInput>
    </TsFormItem>
    <TsFormItem label="邮件内容" labelPosition="right">
      <TsCodemirror
        v-model="configLocal.content"
        codeMode="html"
      ></TsCodemirror>
      <div class="text-grey">
        {{ contentHelp }}
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
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  props: {
    value: { type: Object, default: () => ({}) },
    trigger: { type: String, default: 'OPEN' }
  },
  data() {
    return {
      configLocal: {
        ...(this.value || {})
      },
      attrList: [],
      isShowAttrList: false
    };
  },
  created() {
    if (!this.configLocal.title) {
      this.$set(this.configLocal, 'title', this.defaultTitle);
    }
    this.listAlertAttrList();
  },
  methods: {
    valid() {
      const sltToUser = this.$refs.sltToUser;
      const txtTitle = this.$refs.txtTitle;
      let isValid = true;
      if (sltToUser && !sltToUser.valid()) {
        isValid = false;
      }
      if (txtTitle && !txtTitle.valid()) {
        isValid = false;
      }
      return isValid;
    },
    getConfig() {
      return this.configLocal;
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList(this.attrSearchParam).then(res => {
        this.attrList = res.Return || [];
      });
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
    defaultTitle() {
      if (this.trigger === 'AGGREGATE') {
        return '[告警中心][聚合通知]共${DATA.alertCount}条告警待处理';
      } else if (this.trigger === 'RECOVER') {
        return '[告警中心][熔断恢复]熔断策略已恢复';
      }
      return '[告警中心][熔断通知]熔断策略已触发';
    },
    attrHelp() {
      return this.isAggregateTrigger
        ? '聚合时可使用聚合变量；若使用单个告警属性变量，默认取alertList中最后一个成员的值。'
        : '当前触发点不是聚合场景，不提供 ${DATA.alertList}、${DATA.alertCount}、${DATA.alertItemList}。';
    },
    contentHelp() {
      return this.isAggregateTrigger
        ? '帮助：为空时使用默认告警列表。可用 ${DATA.alertCount}、${DATA.alertList}、${DATA.alertItemList}。'
        : '帮助：当前触发点只提供单个告警上下文变量，不提供聚合变量。';
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
