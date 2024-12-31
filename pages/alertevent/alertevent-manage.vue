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
            <span>
              <b class="text-grey">{{ alertTypeData.label }}</b>
            </span>
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
          <div v-if="currentEventData" class="tab-container">
            <div v-if="currentEventData.description" class="ml-lg mr-lg">
              <div class="mb-xs text-grey">
                <h4>{{ $t('page.tip') }}</h4>
              </div>
              <div class="text-grey">{{ currentEventData.description }}</div>
              <Divider></Divider>
            </div>
            <draggable
              v-if="isReady && eventHandlerList && eventHandlerList.length > 0"
              tag="div"
              :list="eventHandlerList"
              handle=".tsfont-drag"
              group="root"
              @change="changeAlertEventHandlerSort"
            >
              <div v-for="(eventhandler, index) in eventHandlerList" :key="index" class="event-grid">
                <div style="text-align: center">
                  <h3 class="text-grey tsfont-drag" style="cursor: move">
                    <span>{{ eventhandler.sort }}</span>
                  </h3>
                </div>
                <div class="border-base padding-md radius-md mb-md bg-op">
                  <div class="text-grey">
                    <h3 class="cursor" :class="{ 'tsfont-drop-right': !isShowStep(eventhandler), 'tsfont-drop-down': isShowStep(eventhandler) }" @click="toggleStep(eventhandler)">{{ eventhandler.name }}</h3>
                  </div>
                  <div v-if="isShowStep(eventhandler)" class="mt-md"><AlertEventViewer :eventHandlerData="eventhandler"></AlertEventViewer></div>
                </div>
                <div style="text-align: right">
                  <Dropdown :transfer="true">
                    <a href="javascript:void(0)" class="tsfont-option-horizontal"></a>
                    <DropdownMenu slot="list">
                      <DropdownItem @click.native="editAlertEventHandler(eventhandler)">{{ $t('page.edit') }}</DropdownItem>
                      <DropdownItem @click.native="delAlertEventHandler(eventhandler)">{{ $t('page.delete') }}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </draggable>
            <div class="event-grid">
              <div style="text-align: center">
                <h3 class="text-grey">{{ eventHandlerList.length + 1 }}</h3>
              </div>
              <div class="border-base padding radius-md bg-op" style="text-align: center; border-style: dashed !important">
                <Dropdown placement="bottom-start" :transfer="true">
                  <a href="javascript:void(0)" class="tsfont-plus">{{ $t('dialog.title.addtarget', { target: $t('page.plugins') }) }}</a>
                  <DropdownMenu slot="list">
                    <DropdownItem v-for="(plugin, hindex) in pluginList" :key="hindex" @click.native="addPlugin(plugin)">{{ plugin.label }}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div></div>
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
      :event="currentEventData"
      @close="closeAlertEventEdit"
    ></AlertEventEdit>
  </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  name: '',
  components: {
    draggable,
    AlertEventEdit: () => import('@/commercial-module/alert/pages/alertevent/alertevent-edit.vue'),
    AlertEventViewer: () => import('@/commercial-module/alert/pages/alertevent/components/view/alertevent-viewer.vue')
  },
  props: {},
  data() {
    return {
      isReady: true,
      isEditEvent: false,
      eventHandlerList: [],
      eventList: [],
      currentEventName: null,
      currentEventHandlerId: null,
      pluginList: [],
      alertTypeData: null,
      typeId: null,
      currentPlugin: null,
      stepHideMap: {}
    };
  },
  beforeCreate() {},
  created() {
    this.typeId = this.$route.params.typeId && parseInt(this.$route.params.typeId);
    this.getAlertTypeById();
    this.listEvent();
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
    toggleStep(eventhandler) {
      this.$set(this.stepHideMap, eventhandler.uuid, !this.stepHideMap[eventhandler.uuid]);
    },
    isShowStep(eventhandler) {
      return !this.stepHideMap[eventhandler.uuid];
    },
    editAlertEventHandler(eventhandler) {
      this.isEditEvent = true;
      this.currentEventHandlerId = eventhandler.id;
    },
    delAlertEventHandler(eventhandler) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('page.component') }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.alertevent.deleteAlertEventHandler(eventhandler.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success('操作成功');
              this.listAlertEventHandler(this.currentEventName);
              vnode.isShow = false;
            }
          });
        }
      });
    },
    changeAlertEventHandlerSort() {
      this.$api.alert.alertevent.updateAlertEventHandlerSort({ idList: this.eventHandlerList.map(d => d.id) }).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success('操作成功');
          this.listAlertEventHandler(this.currentEventName);
        }
      });
    },
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
    listEventPlugin(eventName) {
      this.$api.alert.alertevent.listEventPlugin({ eventName: eventName }).then(res => {
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
    listAlertEventHandler(eventName) {
      this.isReady = false;
      this.$api.alert.alertevent.listAlertEventHandler({ event: eventName }).then(res => {
        this.eventHandlerList = res.Return;
        this.isReady = true;
      });
    },
    closeAlertEventEdit(needRefresh) {
      this.isEditEvent = false;
      this.currentEventHandlerId = null;
      this.currentPlugin = null;
      if (needRefresh && this.currentEventName) {
        this.listAlertEventHandler(this.currentEventName);
      }
    }
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
          this.listAlertEventHandler(val);
          this.listEventPlugin(val);
        } else {
          this.eventHandlerList = [];
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.event-grid {
  display: grid;
  grid-template-columns: 60px auto 30px;
}
.tab-container {
  height: calc(100vh - 170px);
  overflow: auto;
}
</style>
