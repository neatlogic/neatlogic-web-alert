<template>
  <div>
    <TsContain>
      <template v-slot:topRight>
        <div class="action-group">
          <div class="action-item tsfont-listsetting" @click="editType()">{{ $t('term.alert.typemanage') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable :theadList="theadList" :tbodyList="pluginList">
          <template v-slot:isActive="{ row }">
            <span v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-grey">{{ $t('page.no') }}</span>
          </template>
          <template v-slot:config="{ row }">
            <PluginConfig :readonly="true" :pluginData="row"></PluginConfig>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="configPlugin(row)">{{ $t('page.config') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <EventPluginConfig v-if="isConfig" :name="currentName" @close="closeConfig"></EventPluginConfig>
    <EventPluginType v-if="isEditType" @close="isEditType = false"></EventPluginType>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    PluginConfig: () => import('@/community-module/alert/pages/alertevent/components/config/alertevent-configer.vue'),
    EventPluginConfig: () => import('@/community-module/alert/pages/alertevent/eventplugin-edit.vue'),
    EventPluginType: () => import('@/community-module/alert/pages/alertevent/eventplugin-type-edit.vue')
  },
  props: {},
  data() {
    return {
      isConfig: false,
      currentName: null,
      pluginList: [],
      theadList: [
        {
          key: 'name',
          title: this.$t('page.uniquekey')
        },
        { key: 'label', title: this.$t('page.name') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'config', title: this.$t('page.config') },
        { key: 'description', title: this.$t('page.description') },
        { key: 'action' }
      ],
      isEditType: false
    };
  },
  beforeCreate() {},
  created() {
    this.getEventPluginList();
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
    editType() {
      this.isEditType = true;
    },
    closeConfig(needRefresh) {
      this.isConfig = false;
      this.currentName = null;
      if (needRefresh) {
        this.getEventPluginList();
      }
    },
    getEventPluginList() {
      this.$api.alert.alertevent.listEventPlugin().then(res => {
        this.pluginList = res.Return;
      });
    },
    configPlugin(plugin) {
      this.isConfig = true;
      this.currentName = plugin.name;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
