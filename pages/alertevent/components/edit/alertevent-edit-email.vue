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
    <TsFormItem label="邮件服务器" labelPosition="left">
      <div>
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
      </div>
    </TsFormItem>
    <TsFormItem label="">
      <TsFormRadio v-model="configLocal.type" :dataList="typeList"></TsFormRadio>
    </TsFormItem>
    <TsFormItem v-if="configLocal.type === 'custom'" :label="$t('term.cmdb.selectedattr')" labelPosition="left">
      <div>
        <span class="cursor text-action" @click="isShowAttrList = !isShowAttrList">
          <span :class="isShowAttrList ? 'tsfont-drop-down' : 'tsfont-drop-right'"></span>
          <span class="ml-xs">{{ $t('term.alert.clickcopyattr') }}</span>
        </span>
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
    <TsFormItem
      v-if="configLocal.type === 'custom'"
      :required="true"
      :label="$t('page.title')"
      labelPosition="left"
    >
      <TsFormInput
        ref="txtTitle"
        v-model="configLocal.title"
        :validateList="[{ name: 'required', message: ' ' }]"
        border="border"
      ></TsFormInput>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.type === 'custom'"
      :required="true"
      :label="$t('page.content')"
      labelPosition="left"
    >
      <div>
        <Poptip
          trigger="hover"
          placement="right"
          width="650"
          :transfer="true"
          :title="'Freemarker' + $t('page.help')"
        >
          <span class="tsfont-info-o text-href">{{ $t('term.process.programarhelp') }}</span>
          <div slot="content">
            <FreemarkerHelp></FreemarkerHelp>
          </div>
        </Poptip>
      </div>
      <TsCodemirror
        ref="txtContent"
        v-model="configLocal.content"
        :validateList="['required']"
        codeMode="html"
      ></TsCodemirror>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.type === 'template'"
      :label="$t('page.template')"
      :required="true"
      labelPosition="left"
    >
      <TsFormSelect
        ref="sltTemplate"
        v-model="configLocal.template"
        dynamicUrl="/api/rest/alert/notifytemplate/search"
        transfer
        border="border"
        :validateList="[{ name: 'required', message: ' ' }]"
        :params="{ isActive: 1 }"
        rootName="tbodyList"
        valueName="id"
        textName="label"
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem :required="true" labelPosition="left" label="收件人">
      <UserSelect
        ref="sltToUser"
        v-model="configLocal.toUserList"
        :validateList="[{ name: 'required', message: ' ' }]"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user', 'team']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem labelPosition="left" :label="$t('term.alert.cc')">
      <UserSelect
        v-model="configLocal.ccUserList"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user', 'team']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.alertinterval')" labelPosition="left">
      <TsFormInput
        v-model="configLocal.interval"
        type="number"
        :min="1"
        :step="1"
        border="border"
      ></TsFormInput>
      <div class="text-grey">帮助：在通知间隔时间（?分钟）内只会通知一次</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
import clipboard from '@/resources/directives/clipboard.js';

export default {
  name: '',
  directives: { clipboard },
  components: {
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
    FreemarkerHelp: () => import('@/community-module/alert/pages/alertevent/components/edit/components/freemarker-help.vue'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
      isShowAttrList: false,
      statusList: [
        {
          value: 'new',
          text: '新告警'
        },
        { value: 'confirmed', text: '已确认' },
        { value: 'proceessing', text: '处理中' },
        { value: 'resolved', text: '已处理' },
        { value: 'closed', text: '已关闭' }
      ],
      typeList: [
        { value: 'custom', text: '自定义' },
        { value: 'template', text: '模板' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertAttrList();
    //补充默认值
    if (!this.configLocal.type) {
      this.$set(this.configLocal, 'type', 'custom');
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
    clipboardSuc() {
      this.$Message.success(this.$t('message.copysuccess'));
    },
    async valid() {
      const txtTitle = this.$refs['txtTitle'];
      const sltToUser = this.$refs['sltToUser'];
      const txtContent = this.$refs['txtContent'];
      const sltTemplate = this.$refs['sltTemplate'];
      let isValid = true;
      if (txtTitle && !txtTitle.valid()) {
        isValid = false;
      }
      if (sltToUser && !sltToUser.valid()) {
        isValid = false;
      }
      if (txtContent && !txtContent.valid()) {
        isValid = false;
      }
      if (sltTemplate && !sltTemplate.valid()) {
        isValid = false;
      }
      return isValid;
    },
    // save() {
    //   if (!this.valid()) return;
    //   const data = this.$utils.clone(this.configLocal);
    //   data.toUserList = data.toUserList.map(item => item.id).join(',');
    //   data.ccUserList = data.ccUserList.map(item => item.id).join(',');
    //   this.$emit('on-save', data);
    // },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList({ isExpand: 1 }).then(res => {
        this.attrList = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
}
</style>
