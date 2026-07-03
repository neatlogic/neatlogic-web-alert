<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <div>
        <TsForm ref="form" v-model="alertRuleData" :item-list="formConfig">
          <template v-slot:config>
            <div>
              <TsTable :theadList="theadList" :tbodyList="alertRuleData.config.ruleList" :fixedHeader="false">
                <template v-slot:pattern="{ row }">
                  <TsFormInput v-model="row.pattern" border="border"></TsFormInput>
                </template>
                <template v-slot:replacement="{ row }">
                  <TsFormInput v-model="row.replacement" border="border"></TsFormInput>
                </template>
                <template slot="action" slot-scope="{ row }">
                  <div class="tstable-action">
                    <ul class="tstable-action-ul">
                      <li class="tsfont-trash-o" @click="deleteRule(row)">{{ $t('page.delete') }}</li>
                    </ul>
                  </div>
                </template>
              </TsTable>
              <div class="mt-sm">
                <Button
                  style="width: 100%"
                  ghost
                  type="primary"
                  @click="addRule()"
                ><span class="tsfont-plus">{{ $t('term.alert.addrule') }}</span></Button>
              </div>
            </div>
          </template>
        </TsForm>
        <div v-if="alertRuleData && alertRuleData.config && alertRuleData.config.ruleList && alertRuleData.config.ruleList.length > 0" class="mt-md">
          <TsFormItem :required="true" :label="$t('term.alert.testdata')">
            <TsFormInput
              ref="content"
              v-model="testContent"
              :validateList="['required']"
              :labelWidth="100"
              border="border"
              type="textarea"
            ></TsFormInput>
          </TsFormItem>
          <TsFormItem v-if="result" :label="$t('term.alert.conversionresult')">
            <div style="white-space: normal; word-break: break-all">{{ result }}</div>
          </TsFormItem>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button
        v-if="alertRuleData && alertRuleData.config && alertRuleData.config.ruleList && alertRuleData.config.ruleList.length > 0"
        type="primary"
        ghost
        @click="test()"
      >{{ $t('page.test') }}</Button>
      <Button type="primary" @click="save()">{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      result: null,
      testContent: null,
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('term.alert.alertsign') }) : this.$t('dialog.title.addtarget', { target: this.$t('term.alert.alertsign') }),
        type: 'modal',
        maskClose: false,
        isShow: true,
        width: 'large'
      },
      theadList: [
        {
          key: 'pattern',
          title: this.$t('term.alert.regexrule')
        },
        { key: 'replacement', title: this.$t('page.replace') },
        { key: 'action' }
      ],
      alertRuleData: { isActive: 1, config: { ruleList: [] } },
      formConfig: {
        name: {
          type: 'text',
          validateList: ['required', 'enchar'],
          label: this.$t('page.uniquekey'),
          maxlength: 50,
          readonly: !!this.id,
          desc: this.$t('term.alert.savecannotmodify')
        },
        label: {
          type: 'text',
          validateList: ['required'],
          label: this.$t('page.name'),
          maxlength: 50
        },
        isActive: {
          type: 'radio',
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ],
          label: this.$t('term.report.isactive')
        },
        attrName: {
          label: this.$t('term.alert.relatedattr'),
          type: 'select',
          url: '/api/rest/alert/attr/list',
          valueName: 'name',
          textName: 'label',
          validateList: ['required'],
          transfer: true,
          desc: this.$t('term.alert.alertsigndesc')
        },
        config: {
          type: 'slot',
          label: this.$t('term.alert.alertsignrule')
        }
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getAlertRule();
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
    test() {
      if (this.$refs.content && this.$refs.content.valid()) {
        const ruleList = this.alertRuleData.config.ruleList;
        if (!ruleList || ruleList.length === 0) {
          this.$Message.info(this.$t('term.alert.atleastonerule'));
          return;
        }
        this.result = null;
        this.$api.alert.rule.testAlertRule({ ruleList: this.alertRuleData.config.ruleList, content: this.testContent }).then(res => {
          this.result = res.Return;
        });
      }
    },
    getAlertRule() {
      if (this.id) {
        this.$api.alert.rule.getAlertRuleById(this.id).then(res => {
          this.alertRuleData = res.Return;
        });
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    addRule() {
      this.alertRuleData.config.ruleList.push({ pattern: '', replacement: '' });
    },
    deleteRule(rule) {
      const index = this.alertRuleData.config.ruleList.indexOf(rule);
      if (index > -1) {
        this.alertRuleData.config.ruleList.splice(index, 1);
      }
    },
    save() {
      const form = this.$refs['form'];
      if (form && form.valid()) {
        const ruleList = this.alertRuleData.config.ruleList;
        if (!ruleList || ruleList.length === 0) {
          this.$Message.info(this.$t('term.alert.atleastonerule'));
          return;
        }
        this.$api.alert.rule.saveAlertRule(this.alertRuleData).then(res => {
          this.$Message.success(this.$t('message.savesuccess'));
          this.close(true);
        });
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
