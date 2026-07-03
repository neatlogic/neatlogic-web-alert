<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editLevel()">{{ $t('page.level') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable :tbodyList="alertLevelList" :theadList="theadList">
          <template v-slot:color="{ row }">
            <div :style="{ background: row.color }" class="radius-sm" style="width: 20px; height: 20px; display: inline-block"></div>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editLevel(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="delLevel(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AlertLevelEdit v-if="isEditLevel" :id="currentLevelId" @close="closeEditLevel"></AlertLevelEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertLevelEdit: () => import('@/community-module/alert/pages/alertlevel/alertlevel-edit-dialog.vue')
  },
  props: {},
  data() {
    return {
      searchParam: {},
      alertLevelList: [],
      currentLevelId: null,
      isEditLevel: false,
      theadList: [
        { key: 'level', title: this.$t('page.level') },
        { key: 'name', title: this.$t('page.uniquekey') },
        { key: 'label', title: this.$t('page.name') },
        { key: 'color', title: this.$t('page.color') },
        { key: 'action', title: '' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertLevel();
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
    closeEditLevel(needRefresh) {
      this.currentLevelId = null;
      this.isEditLevel = false;
      if (needRefresh) {
        this.listAlertLevel();
      }
    },
    editLevel(level) {
      if (level) {
        this.currentLevelId = level.id;
      }
      this.isEditLevel = true;
    },
    listAlertLevel() {
      this.$api.alert.alertlevel.listAlertLevel().then(res => {
        this.alertLevelList = res.Return;
      });
    },
    delLevel(level) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.level')}),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.alertlevel.deleteAlertLevel(level.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.listAlertLevel();
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
