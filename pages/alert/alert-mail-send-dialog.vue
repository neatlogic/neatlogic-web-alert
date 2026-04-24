<template>
  <div class="alert-mail-send-form">
    <TsForm ref="mainForm" v-model="formValue" :item-list="formConfig">
      <template v-slot:attr>
        <div>
          <span class="cursor text-action" @click="isShowAttrList = !isShowAttrList">
            <span :class="isShowAttrList ? 'tsfont-drop-down' : 'tsfont-drop-right'"></span>
            <span class="ml-xs">点击复制属性</span>
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
      </template>
      <template v-slot:content>
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
          v-model="formValue.content"
          :validateList="['required']"
          codeMode="html"
        ></TsCodemirror>
      </template>
    </TsForm>
    <div class="text-right mt-md">
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" class="ml-xs" @click="sendMail()">{{ $t('page.send') }}</Button>
    </div>
  </div>
</template>
<script>
import clipboard from '@/resources/directives/clipboard.js';

export default {
  name: '',
  directives: { clipboard },
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    FreemarkerHelp: () => import('@/community-module/alert/pages/alertevent/components/edit/components/freemarker-help.vue'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror')
  },
  props: {
    alertId: { type: Number, required: true }
  },
  data() {
    return {
      attrList: [],
      isShowAttrList: false,
      formValue: {
        toUserList: [],
        templateId: null,
        title: '',
        content: ''
      }
    };
  },
  created() {
    this.listAlertAttrList();
  },
  methods: {
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    sendMail() {
      const mainForm = this.$refs.mainForm;
      const txtContent = this.$refs.txtContent;
      let isValid = true;
      if (mainForm && !mainForm.valid()) {
        isValid = false;
      }
      if (!this.formValue.templateId && txtContent && !txtContent.valid()) {
        isValid = false;
      }
      if (!isValid) {
        return;
      }
      const param = {
        alertId: this.alertId,
        toUserList: this.formValue.toUserList,
        templateId: this.formValue.templateId,
        title: this.formValue.title,
        content: this.formValue.content
      };
      this.$api.alert.alert.sendMail(param).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('message.executesuccess'));
          this.close(true);
        }
      });
    },
    clipboardSuc() {
      this.$Message.success(this.$t('message.copysuccess'));
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList({ isExpand: 1 }).then(res => {
        this.attrList = res.Return;
      });
    }
  },
  computed: {
    formConfig() {
      const config = {
        toUserList: {
          type: 'userselect',
          label: this.$t('page.recipient'),
          multiple: true,
          transfer: true,
          groupList: ['user', 'team'],
          validateList: ['required']
        },
        templateId: {
          type: 'select',
          label: '通知模板',
          dynamicUrl: '/api/rest/alert/notifytemplate/search',
          params: { isActive: 1 },
          rootName: 'tbodyList',
          valueName: 'id',
          textName: 'label',
          transfer: true,
          clearable: true
        }
      };
      if (!this.formValue.templateId) {
        config.attr = { type: 'slot', label: '属性列表' };
        config.title = {
          type: 'text',
          label: this.$t('page.title'),
          validateList: ['required']
        };
        config.content = {
          type: 'slot',
          label: this.$t('page.content')
        };
      }
      return config;
    }
  }
};
</script>
