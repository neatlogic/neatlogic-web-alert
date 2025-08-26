<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <TsForm ref="mainForm" v-model="notifyTemplateData" :item-list="formConfig">
          <template v-slot:attr>
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
              v-model="notifyTemplateData.content"
              :validateList="['required']"
              codeMode="html"
            ></TsCodemirror>
          </template>
        </TsForm>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" @click="save()">{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
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
    id: { type: Number },
    isCopy: {type: Boolean, default: false}
  },
  data() {
    return {
      attrList: [],
      formConfig: {
        name: {
          type: 'text',
          label: this.$t('page.uniquekey'),
          maxlength: 50,
          validateList: ['required']
        },
        label: {
          type: 'text',
          label: this.$t('page.name'),
          maxlength: 50,
          validateList: ['required']
        },
        isActive: {
          type: 'radio',
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ],
          label: this.$t('term.report.isactive'),
          trueValue: 1,
          falseValue: 0
        },
        attr: { type: 'slot', label: '属性列表' },
        title: {
          type: 'text',
          label: this.$t('page.title'),
          desc: '有些应用场景不一定有标题，例如短信等'
        },
        content: {
          type: 'slot',
          label: this.$t('page.content')
        }
      },
      notifyTemplateData: { isActive: 1 },
      dialogConfig: {
        title: this.id ? (this.isCopy ? this.$t('dialog.title.copytarget', {'target': this.$t('page.template')}) : this.$t('dialog.title.edittarget', { target: this.$t('page.template') })) : this.$t('dialog.title.addtarget', { target: this.$t('page.template') }),
        type: 'modal',
        isShow: true,
        width: 'medium'
      }
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertAttrList();
    this.getNotifyTemplateById();
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
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    save() {
      if (this.$refs.mainForm && this.$refs.mainForm.valid()) {
        this.$api.alert.notifytemplate.saveNotifyTemplate(this.notifyTemplateData).then(res => {
          this.$Message.success(this.$t('message.savesuccess'));
          this.close(true);
        });
      }
    },
    getNotifyTemplateById() {
      if (this.id) {
        this.$api.alert.notifytemplate.getNotifyTemplateById(this.id).then(res => {
          this.notifyTemplateData = res.Return;
          if (this.isCopy) {
            this.notifyTemplateData.name = this.notifyTemplateData.name + '_copy';
            this.notifyTemplateData.id = null;
          }
        });
      }
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
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
