<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group"><div class="action-item tsfont-plus" @click="editRule()">特征</div></div>
      </template>
      <template v-slot:content>
        <TsTable :tbodyList="alertRuleList" :theadList="theadList" :canSelectRow="false">
          <template v-slot:isActive="{ row }">
            <div v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</div>
            <div v-else class="text-grey">{{ $t('page.no') }}</div>
          </template>
          <template v-slot:config="{ row }">
            <div>
              <TsRow>
                <Col :span="12" class="text-grey">规则（正则表达式）</Col>
                <Col :span="12" class="text-grey">替换</Col>
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
                <li class="tsfont-edit" @click="editRule(row)">编辑</li>
                <li class="tsfont-trash-o" @click="deleteRule(row)">删除</li>
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
    AlertRuleEdit: () => import('@/commercial-module/alert/pages/alertrule/alertrule-edit-dialog.vue')
  },
  props: {},
  data() {
    return {
      isEdit: false,
      alertRuleList: [],
      currentId: null,
      theadList: [
        {
          key: 'name',
          title: '唯一标识'
        },
        { key: 'label', title: '名称' },
        { key: 'isActive', title: '是否激活' },
        { key: 'attrName', title: '关联属性' },
        { key: 'config', title: '配置' },
        { key: 'action' }
      ],
      ruleTheadList: [
        {
          key: 'pattern',
          title: '规则（正则表达式）'
        },
        { key: 'replacement', title: '替换' }
      ]
    };
  },
  beforeCreate() {},
  created() {
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
        title: '删除确认',
        content: '是否确认删除当前规则？',
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.rule.deleteAlertRule(rule.id).then(res => {
            this.$Message.success('删除成功');
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
