<template>
  <div>
    <TsFormItem :label="$t('term.alert.mailserver')" labelPosition="right">
      <TsFormSelect
        v-model="configLocal.mailServerId"
        url="/api/rest/mailserver/list"
        transfer
        rootName="tbodyList"
        valueName="id"
        textName="name"
        border="border"
      ></TsFormSelect>
      <div class="text-grey">{{ $t('term.alert.defaultmailserverhelp') }}</div>
    </TsFormItem>
    <TsFormItem :required="true" labelPosition="right" :label="$t('page.recipient')">
      <UserSelect
        ref="sltToUser"
        v-model="configLocal.toUserList"
        :validateList="[{ name: 'required', message: ' ' }]"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user', 'team']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem labelPosition="right" :label="$t('page.cc')">
      <UserSelect
        v-model="configLocal.ccUserList"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user', 'team']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.attributelist')" labelPosition="right">
      <div>
        <span class="cursor text-action" @click="isShowAttrList = !isShowAttrList">
          <span :class="isShowAttrList ? 'tsfont-drop-down' : 'tsfont-drop-right'"></span>
          <span class="ml-xs">{{ $t('term.alert.clickcopyattr') }}</span>
        </span>
        <div v-if="attrHelp" class="text-grey mt-xs">{{ attrHelp }}</div>
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
    <TsFormItem :label="$t('term.alert.mailtitle')" labelPosition="right" :required="true">
      <TsFormInput
        ref="txtTitle"
        v-model="configLocal.title"
        type="textarea"
        :maxlength="500"
        :validateList="[{ name: 'required', message: ' ' }]"
        border="border"
      ></TsFormInput>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.mailcontent')" labelPosition="right">
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
        return this.$t('term.alert.aggregatealertmailtitle');
      } else if (this.trigger === 'RECOVER') {
        return this.$t('term.alert.breakerrecovermailtitle');
      }
      return this.$t('term.alert.breakeropenmailtitle');
    },
    attrHelp() {
      return this.isAggregateTrigger ? this.$t('term.alert.aggregateattrhelp') : '';
    },
    contentHelp() {
      return this.isAggregateTrigger ? this.$t('term.alert.aggregatecontenthelp') : '';
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
