<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editSource()">{{ $t('page.source') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable v-bind="alertSourceData" :theadList="theadList" @changeCurrent="searchAlertSource">
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editSource(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="delSource(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AlertSourceEdit v-if="isEditSource" :name="currentName" @close="closeEdit"></AlertSourceEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertSourceEdit: () => import('@/community-module/alert/pages/alertsource/alertsource-edit.vue')
  },
  props: {},
  data() {
    return {
      searchParam: { currentPage: 1 },
      alertSourceData: {},
      currentName: null,
      theadList: [
        {
          key: 'name',
          title: this.$t('page.uniquekey')
        },
        { key: 'label', title: this.$t('page.name') },
        { key: 'action' }
      ],
      isEditSource: false
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertSource();
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
    searchAlertSource(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      this.$api.alert.source.searchAlertSource(this.searchParam).then(res => {
        this.alertSourceData = res.Return;
      });
    },
    closeEdit(needRefresh) {
      this.isEditSource = false;
      this.currentName = null;
      if (needRefresh) {
        this.searchAlertSource(1);
      }
    },
    editSource(source) {
      this.isEditSource = true;
      if (source) {
        this.currentName = source.name;
      }
    },
    delSource(source) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.source')}),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.source.deleteAlertSourceByName(source.name).then((res) => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.searchAlertSource(1);
            }
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
<style lang="less"></style>
