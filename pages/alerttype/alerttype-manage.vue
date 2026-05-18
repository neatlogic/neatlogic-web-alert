<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editAlertType()">{{ $t('term.alert.alerttype') }}</div>
        </div>
      </template>
      <template slot="topRight">
        <div class="action-group">
          <div class="action-item">
            <RadioGroup v-model="showMode" type="button">
              <Radio label="card"><i class="tsfont-blocklist"></i></Radio>
              <Radio label="table"><i class="tsfont-list"></i></Radio>
            </RadioGroup>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="showMode === 'card'">
          <TsCard
            v-bind="alertTypeData"
            :sm="8"
            :lg="6"
            :xl="6"
            :xxl="6"
          >
            <template v-slot:header="{ row }">
              <div class="cursor mr-sm ml-sm" @click="editAlertEvent(row)">
                <span>
                  <b class="text-grey">{{ row.label }}·{{ row.name }}</b>
                </span>
                <span v-if="!row.isActive" class="ml-md text-error">{{ $t('page.ban') }}</span>
              </div>
            </template>
            <template slot-scope="{ row }">
              <div style="height: 120px; overflow: auto" class="cursor mr-sm ml-sm mb-md" @click="editAlertEvent(row)">
                <div v-if="row.adaptorList && row.adaptorList.length > 0">
                  <Divider orientation="start" style="margin: 3px 0px !important; padding: 0px !important"><span class="fz10 text-grey">{{ $t('term.alert.transferplugin') }}</span></Divider>
                </div>
                <div v-if="row.adaptorList && row.adaptorList.length > 0" class="mb-sm">
                  <Tag v-for="(adaptor, index) in row.adaptorList" :key="index">{{ adaptor.name }}·{{ adaptor.label }}</Tag>
                </div>
                <div v-if="row.alertEventHandlerList && row.alertEventHandlerList.length > 0">
                  <Divider orientation="start" style="margin: 3px 0px !important; padding: 0px !important"><span class="fz10 text-grey">{{ $t('term.alert.eventplugin') }}</span></Divider>
                </div>
                <div v-if="row.alertEventHandlerList && row.alertEventHandlerList.length > 0">
                  <span v-for="(event, index) in getEventPluginCount(row)" :key="index" class="mb-sm mr-sm overflow">
                    <span>{{ event.label }}</span>
                    <span class="ml-xs">
                      <b class="text-primary">{{ event.count }}</b>
                    </span>
                  </span>
                </div>
              </div>
            </template>
            <template v-slot:control="{ row }">
              <div class="action-item" @click.stop="editAlertType(row)">{{ $t('page.edit') }}</div>
              <div class="action-item" @click.stop="delAlertType(row)">{{ $t('page.delete') }}</div>
            </template>
          </TsCard>
        </div>
        <div v-else>
          <TsTable
            v-bind="alertTypeData"
            :theadList="theadList"
            @changeCurrent="searchAlertType"
            @changePageSize="changePageSize"
          >
            <template v-slot:isActive="{ row }">
              <span v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</span>
              <span v-else class="text-grey">{{ $t('page.no') }}</span>
            </template>
            <template v-slot:adaptorList="{ row }">
              <div v-if="row.adaptorList && row.adaptorList.length > 0">
                <Tag v-for="(adaptor, index) in row.adaptorList" :key="index">{{ adaptor.name }}·{{ adaptor.label }}</Tag>
              </div>
              <div v-else class="text-grey">-</div>
            </template>
            <template v-slot:eventList="{ row }">
              <span v-for="(event, index) in getEventPluginCount(row)" :key="index" class="mb-sm mr-sm overflow">
                <span>{{ event.label }}</span>
                <span class="ml-xs">
                  <b class="text-primary">{{ event.count }}</b>
                </span>
              </span>
            </template>
            <template v-slot:fcu="{ row }">
              <UserCard :uuid="row.fcu" :hideAvatar="true"></UserCard>
            </template>
            <template v-slot:lcu="{ row }">
              <UserCard :uuid="row.lcu" :hideAvatar="true"></UserCard>
            </template>
            <template slot="action" slot-scope="{ row }">
              <div class="tstable-action">
                <ul class="tstable-action-ul">
                  <li class="tsfont-lightning" @click="editAlertEvent(row)">{{ $t('page.event') }}</li>
                  <li class="tsfont-edit" @click="editAlertType(row)">{{ $t('page.edit') }}</li>
                  <li class="tsfont-trash-o" @click="delAlertType(row)">{{ $t('page.delete') }}</li>
                </ul>
              </div>
            </template>
          </TsTable>
        </div>
      </template>
    </TsContain>
    <AlertTypeEidt v-if="isShowAlerType" :id="currentAlertTypeId" @close="closeAlertType"></AlertTypeEidt>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsCard: () => import('@/resources/components/TsCard/TsCard.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertTypeEidt: () => import('@/community-module/alert/pages/alerttype/alerttype-edit-dialog.vue'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue')
  },
  props: {},
  data() {
    return {
      showMode: 'card',
      searchParam: {},
      alertTypeData: {},
      currentAlertTypeId: null,
      isShowAlerType: false,
      eventList: [],
      theadList: [
        {
          key: 'name',
          title: this.$t('page.uniquekey')
        },
        { key: 'label', title: this.$t('page.name') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'adaptorList', title: this.$t('term.alert.transferplugin') },
        { key: 'eventList', title: this.$t('term.alert.eventplugin') },
        { key: 'fcu', title: this.$t('page.creator') },
        { key: 'fcd', title: this.$t('page.createtime'), type: 'time' },
        { key: 'lcu', title: this.$t('page.fcu') },
        { key: 'lcd', title: this.$t('page.fcd'), type: 'time' },
        { key: 'action' }
      ]
    };
  },
  beforeCreate() {},
  async created() {
    await this.listEvent();
    this.searchAlertType();
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
    getEventPluginCount(row) {
      const eventCount = [];
      if (row.alertEventHandlerList) {
        this.eventList.forEach(event => {
          row.alertEventHandlerList.forEach(handler => {
            if (handler.event === event.name) {
              const data = eventCount.find(d => d.name === handler.event);
              if (!data) {
                eventCount.push({
                  name: handler.event,
                  label: event.label,
                  count: 1
                });
              } else {
                data.count++;
              }
            }
          });
        });
      }
      return eventCount;
    },
    async listEvent() {
      await this.$api.alert.alertevent.listAlertEvent().then(res => {
        this.eventList = res.Return;
      });
    },
    closeAlertType(needRefresh) {
      this.isShowAlerType = false;
      this.currentAlertTypeId = null;
      if (needRefresh) {
        this.searchAlertType();
      }
    },
    editAlertEvent(row) {
      this.$router.push({ path: '/alertevent-manage/' + row.id });
    },
    editAlertType(row) {
      if (row) {
        this.currentAlertTypeId = row.id;
      } else {
        this.currentAlertTypeId = null;
      }
      this.isShowAlerType = true;
    },
    changePageSize(pageSize) {
      if (pageSize) {
        this.searchParam.pageSize = pageSize;
        this.searchAlertType(1);
      }
    },
    searchAlertType(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      this.$api.alert.alerttype.searchAlertType(this.searchParam).then(res => {
        this.alertTypeData = res.Return;
      });
    },
    delAlertType(row) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('term.alert.alerttype') }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.alerttype.deleteAlertType(row.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.searchAlertType();
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
