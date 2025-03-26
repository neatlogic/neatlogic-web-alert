<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editTemplate()">{{ $t('page.template') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable
          v-bind="notifyTemplateData"
          :theadList="theadList"
          @changeCurrent="changeCurrent"
          @changePageSize="changePageSize"
        >
          <template v-slot:isActive="{ row }">
            <span v-if="row.isActive === 1" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-error">{{ $t('page.no') }}</span>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editTemplate(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="deleteTemplate(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <TemplateEdit v-if="isEditTemplate" :id="currentTemplateId" @close="closeEdit"></TemplateEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    TemplateEdit: () => import('@/commercial-module/alert/pages/notifytemplate/notify-template-edit.vue')
  },
  props: {},
  data() {
    return {
      isEditTemplate: false,
      currentTemplateId: null,
      searchParam: {},
      notifyTemplateData: null,
      theadList: [
        {
          key: 'name',
          title: '唯一标识'
        },
        { key: 'label', title: '名称' },
        { key: 'isActive', title: '是否激活' },
        { key: 'action' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.searchNotifyTemplate();
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
    closeEdit(needRefresh) {
      this.isEditTemplate = false;
      this.currentTemplateId = null;
      if (needRefresh) {
        this.searchNotifyTemplate();
      }
    },
    editTemplate(template) {
      if (template) {
        this.currentTemplateId = template.id;
      }
      this.isEditTemplate = true;
    },
    deleteTemplate(template) {
      if (template) {
        this.$createDialog({
          title: this.$t('dialog.title.deleteconfirm'),
          content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.template')}),
          btnType: 'error',
          'on-ok': vnode => {
            this.$api.alert.notifytemplate.deleteNotifyTemplate(template.id).then(res => {
              this.$Message.success(this.$t('message.deletesuccess'));
              this.changeCurrent(1);
              vnode.isShow = false;
            });
          }
        });
      }
    },
    changeCurrent(currentPage) {
      this.searchParam.currentPage = currentPage;
      this.searchNotifyTemplate();
    },
    changePageSize(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchParam.currentPage = 1;
      this.searchNotifyTemplate();
    },
    searchNotifyTemplate() {
      this.$api.alert.notifytemplate.searchNotifyTemplate(this.searchParam).then(res => {
        this.notifyTemplateData = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
