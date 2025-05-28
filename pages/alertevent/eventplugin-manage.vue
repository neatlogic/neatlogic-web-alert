<template>
  <div>
    <TsContain>
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
                <li class="tsfont-edit" @click="configPlugin(row)">配置</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <EventPluginConfig
      v-if="isConfig"
      :name="currentName"
      @close="closeConfig"
    ></EventPluginConfig>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    PluginConfig: () => import('@/community-module/alert/pages/alertevent/components/config/alertevent-configer.vue'),
    EventPluginConfig: () => import('@/community-module/alert/pages/alertevent/eventplugin-edit.vue')
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
          title: '唯一标识'
        },
        { key: 'label', title: '名称' },
        {key: 'isActive', title: '激活'},
        { key: 'config', title: '配置' },
        { key: 'description', title: '描述' },
        { key: 'action' }
      ]
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
