<template>
  <div>
    <TsContain>
      <template v-slot:navigation>
        <span v-if="$hasBack()" class="tsfont-left text-action" @click="$back()">{{ $getFromPage() }}</span>
      </template>
      <template v-slot:topLeft>
        <div v-if="alertTypeData" class="action-group">
          <div class="action-item">
            <span class="text-grey mr-xs">告警类型</span>
            <span><b class="text-grey">{{ alertTypeData.label }}</b></span>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="alertTypeData">
          <Tabs v-model="currentEventName">
            <TabPane
              v-for="(event, index) in eventList"
              :key="index"
              :label="event.label"
              :name="event.name"
            ></TabPane>
          </Tabs>
          <div v-if="currentEventData">
            <div v-for="(eventhandler, index) in eventHandlerList" :key="index" class="border-base padding radius-md mb-md bg-op">
              <div class="text-grey mb-md"><h3>{{ eventhandler.name }}</h3></div>
              <div><AlertEventViewer :eventHandlerData="eventhandler"></AlertEventViewer></div>
            </div>
            <div class="border-base padding radius-md bg-op" style="text-align: center; border-style: dashed !important">
              <Dropdown placement="bottom-start">
                <a href="javascript:void(0)" class="tsfont-plus">添加插件</a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="(plugin, hindex) in pluginList" :key="hindex" @click.native="addPlugin(plugin)">{{ plugin.label }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </template>
    </TsContain>
    <AlertEventEdit
      v-if="isEditEvent"
      :id="currentEventHandlerId"
      :plugin="currentPlugin"
      :alertType="alertTypeData"
      :event="currentEventName"
      @close="closeAlertEventEdit"
    ></AlertEventEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    AlertEventEdit: () => import('@/commercial-module/alert/pages/alertevent/alertevent-edit.vue'),
    AlertEventViewer: () => import('@/commercial-module/alert/pages/alertevent/components/view/alertevent-viewer.vue')
  },
  props: {},
  data() {
    return {
      isEditEvent: false,
      eventHandlerList: [],
      eventList: [],
      currentEventName: null,
      currentEventHandlerId: null,
      pluginList: [],
      alertTypeData: null,
      typeId: null
    };
  },
  beforeCreate() {},
  created() {
    this.typeId = this.$route.params.typeId && parseInt(this.$route.params.typeId);
    this.getAlertTypeById();
    this.listEvent();
    this.listEventPlugin();
    //this.listEventHandler();
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
    selectAlertType(type) {
      this.currentAlertType = type;
    },
    getAlertTypeById() {
      if (this.typeId) {
        this.$api.alert.alerttype.getAlertTypeById(this.typeId).then(res => {
          this.alertTypeData = res.Return;
        });
      }
    },
    addPlugin(plugin) {
      this.isEditEvent = true;
      this.currentPlugin = plugin;
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin().then(res => {
        this.pluginList = res.Return;
      });
    },
    listEvent() {
      this.$api.alert.alertevent.listAlertEvent().then(res => {
        this.eventList = res.Return;
        if (this.eventList && this.eventList.length > 0) {
          this.currentEventName = this.eventList[0].name;
        }
      });
    },
    listEventHandler(eventName) {
      this.$api.alert.alertevent.listAlertEventHandler({ event: eventName }).then(res => {
        this.eventHandlerList = res.Return;
      });
    },
    closeAlertEventEdit(needRefresh) {
      this.isEditEvent = false;
      this.currentEventHandlerId = null;
      this.currentPlugin = null;
      if (needRefresh && this.currentEventName) {
        this.listEventHandler(this.currentEventName);
      }
    },
    editAlertEvent(id) {
      this.isEditEvent = true;
      this.currentEventHandlerId = id;
    },
    deleteAlertEvent(id) {}
  },
  filter: {},
  computed: {
    currentEventData() {
      if (this.currentEventName) {
        return this.eventList.find(item => item.name === this.currentEventName);
      }
      return null;
    }
  },
  watch: {
    currentEventName: {
      handler(val) {
        if (val) {
          this.listEventHandler(val);
        } else {
          this.eventHandlerList = [];
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less"></style>
