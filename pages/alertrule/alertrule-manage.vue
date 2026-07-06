<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group"><div class="action-item tsfont-plus" @click="editRule()">{{ $t('term.alert.alertsign') }}</div></div>
      </template>
      <template v-slot:content>
        <TsTable :tbodyList="alertRuleList" :theadList="theadList" :canSelectRow="false">
          <template v-slot:attrName="{ row }">
            <span>{{ getAttr(row.attrName) }}</span>
          </template>
          <template v-slot:isActive="{ row }">
            <div v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</div>
            <div v-else class="text-grey">{{ $t('page.no') }}</div>
          </template>
          <template v-slot:config="{ row }">
            <div>
              <TsRow>
                <Col :span="12" class="text-grey">{{ $t('term.alert.regexrule') }}</Col>
                <Col :span="12" class="text-grey">{{ $t('page.replace') }}</Col>
              </TsRow>
              <TsRow v-for="(rule, index) in row.config.ruleList" :key="index">
                <Col :span="12">
                  <b class="text-grey">{{ rule.pattern }}</b>
                </Col>
                <Col :span="12">
                  <b class="text-grey">{{ rule.replacement }}</b>
                </Col>
                <Col v-if="index < row.config.ruleList.length - 1" :span="24"><Divider style="margin: 3px !important"></Divider></Col>
              </TsRow>
            </div>
          </template>
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editRule(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="deleteRule(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AlertRuleEdit v-if="isEdit" :id="currentId" @close="closeEditRule"></AlertRuleEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertRuleEdit: () => import('@/community-module/alert/pages/alertrule/alertrule-edit-dialog.vue')
  },
  props: {},
  data() {
    return {
      isEdit: false,
      alertRuleList: [],
      currentId: null,
      attrList: [],
      theadList: [
        {
          key: 'name',
          title: this.$t('page.uniquekey')
        },
        { key: 'label', title: this.$t('page.name') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'attrName', title: this.$t('term.alert.relatedattr') },
        { key: 'config', title: this.$t('page.config') },
        { key: 'action' }
      ],
      ruleTheadList: [
        {
          key: 'pattern',
          title: this.$t('term.alert.regexrule')
        },
        { key: 'replacement', title: this.$t('page.replace') }
      ]
    };
  },
  beforeCreate() {},
  async created() {
    await this.listAlertAttrList();
    this.listAlertRule();
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
    getAttr(name) {
      if (this.attrList) {
        const attr = this.attrList.find(d => d.name === name);
        if (attr) {
          return attr.label + '·' + attr.name;
        }
      }
      return null;
    },
    async listAlertAttrList() {
      const param = {};
      await this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    listAlertRule() {
      this.$api.alert.rule.listAlertRule().then(res => {
        this.alertRuleList = res.Return;
      });
    },
    closeEditRule(needRefresh) {
      this.isEdit = false;
      this.currentId = null;
      if (needRefresh) {
        this.listAlertRule();
      }
    },
    editRule(rule) {
      this.isEdit = true;
      if (rule) {
        this.currentId = rule.id;
      } else {
        this.currentId = null;
      }
    },
    deleteRule(rule) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('page.rule') }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.rule.deleteAlertRule(rule.id).then(res => {
            this.$Message.success(this.$t('message.deletesuccess'));
            this.listAlertRule();
            vnode.isShow = false;
          });
        }
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
}
</style>
