<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="可选属性" labelPosition="left">
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
    </TsFormItem>
    <TsFormItem :required="true" label="标题" labelPosition="left">
      <TsFormInput
        ref="txtTitle"
        v-model="configLocal.title"
        :validateList="['required']"
        border="border"
      ></TsFormInput>
    </TsFormItem>
    <TsFormItem :required="true" label="内容" labelPosition="left">
      <div>
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
      </div>
      <TsCodemirror
        ref="txtContent"
        v-model="configLocal.content"
        :validateList="['required']"
        codeMode="html"
      ></TsCodemirror>
    </TsFormItem>
    <TsFormItem :required="true" labelPosition="left" label="收件人">
      <UserSelect
        ref="sltToUser"
        v-model="configLocal.toUserList"
        :validateList="['required']"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem labelPosition="left" label="抄送">
      <UserSelect
        v-model="configLocal.ccUserList"
        :multiple="true"
        :transfer="true"
        :groupList="['alertUserType', 'user']"
      ></UserSelect>
    </TsFormItem>
    <TsFormItem label="通知间隔" labelPosition="left">
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
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
import clipboard from '@/resources/directives/clipboard.js';

export default {
  name: '',
  directives: { clipboard },
  components: {
    FreemarkerHelp: () => import('@/commercial-module/alert/pages/alertevent/components/edit/components/freemarker-help.vue'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
      statusList: [
        {
          value: 'new',
          text: '新告警'
        },
        { value: 'confirmed', text: '已确认' },
        { value: 'proceessing', text: '处理中' },
        { value: 'resolved', text: '已处理' },
        { value: 'closed', text: '已关闭' }
      ]
    };
  },
  beforeCreate() {},
  created() {
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
    clipboardSuc() {
      this.$Message.success(this.$t('message.copysuccess'));
    },
    async valid() {
      const txtTitle = this.$refs['txtTitle'];
      const sltToUser = this.$refs['sltToUser'];
      const txtContent = this.$refs['txtContent'];
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
      this.$api.alert.alert.listAlertAttrList().then(res => {
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
