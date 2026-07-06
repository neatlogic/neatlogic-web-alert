<template>
  <div>
    <TsTable :theadList="auditHeaderList" v-bind="auditData" @changeCurrent="searchAlertAudit">
      <template v-slot:attrName="{ row }">
        {{ getAttrByName(row.attrName) && getAttrByName(row.attrName).label }}
      </template>
      <template v-slot:inputUser="{ row }">
        <UserCard :uuid="row.inputUser" :hideAvatar="true"></UserCard>
      </template>
      <template v-slot:oldValue="{ row }">
        <AlertAttrViewer mode="audit" :attr="getAttrByName(row.attrName)" :value="row.oldValueList"></AlertAttrViewer>
      </template>
      <template v-slot:newValue="{ row }">
        <AlertAttrViewer mode="audit" :attr="getAttrByName(row.attrName)" :value="row.newValueList"></AlertAttrViewer>
      </template>
    </TsTable>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue')
  },
  props: {
    alertData: { type: Object },
    attrList: { type: Array }
  },
  data() {
    return {
      auditData: {},
      auditHeaderList: [
        { key: 'inputTime', title: this.$t('term.alert.operationtime'), type: 'time' },
        { key: 'inputUser', title: this.$t('term.alert.operationuser') },
        { key: 'inputFromName', title: this.$t('term.alert.operationsource') },
        { key: 'attrName', title: this.$t('page.attribute') },
        { key: 'oldValue', title: this.$t('term.alert.oldvalue') },
        { key: 'newValue', title: this.$t('term.alert.newvalue') }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertAudit();
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
    searchAlertAudit(currentPage) {
      const param = { alertId: this.alertData.id };
      if (currentPage) {
        param.currentPage = currentPage;
      }
      this.$api.alert.alert.searchAlertAudit(param).then(res => {
        this.auditData = res.Return;
      });
    },
    getAttrByName(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
