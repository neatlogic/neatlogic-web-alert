<template>
  <TsContain :hasContentPadding="false" :hideHeader="!hasHeader">
    <template v-slot:navigation>
      <span v-if="$hasBack()" class="tsfont-left text-action" @click="$back()">{{ $getFromPage() }}</span>
    </template>
    <template v-slot:topLeft>
      <div class="action-group">
        <div class="action-item">
          <h3 class="text-grey">{{ topoData.name }}</h3>
        </div>
      </div>
    </template>
    <template v-slot:topRight>
      <div class="action-group">
        <div class="action-item" style="width: 300px">
          <CombineSearcher v-if="graphConfig && graphConfig.filterAttrList && graphConfig.filterAttrList.length > 0" v-model="searchVal" v-bind="searchConfig">
            <template v-for="(attr, index) in graphConfig.filterAttrList" :slot="attr" slot-scope="{ valueConfig, textConfig }">
              <div :key="index">
                <ConditionItem
                  v-if="getAttrByName(attr)"
                  :conditionItem="getAttrByName(attr)"
                  @change="
                    val => {
                      if (val != null) {
                        $set(valueConfig, attr, val);
                        $set(textConfig, attr, val);
                      } else {
                        $delete(valueConfig, attr);
                        $delete(textConfig, attr);
                      }
                    }
                  "
                ></ConditionItem>
              </div>
            </template>
          </CombineSearcher>
        </div>
        <div class="action-item">
          <Button type="primary" @click="filterAlert()">过滤</Button>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div style="height: 34px">
        <TopoToolbar
          :readonly="true"
          :selectedNode="selectedNode"
          :selectedEdge="selectedEdge"
          :graph="graph"
          :config="config"
          :needMinimap="true"
          mode="graph"
          @fullscreen="fullscreen()"
          @edge-change="
            val => {
              activedEdge = val;
            }
          "
        ></TopoToolbar>
      </div>
      <TsContain
        v-if="!loading"
        :isSiderHide="config.isSiderHide"
        :isRightSiderHide="config.isRightSiderHide"
        :enableCollapse="true"
        :hideHeader="true"
        :rightWidth="280"
        :gutter="0"
      >
        <template v-slot:content>
          <div ref="graph" style="height: 100%">
            <TopoEditor
              :config="graphConfig"
              mode="graph"
              :readonly="true"
              @ready="ready"
              @render:done="renderDone"
            ></TopoEditor>
          </div>
        </template>
      </TsContain>
    </template>
  </TsContain>
</template>
<script>
import screenfull from '@/resources/assets/js/screenfull.js';

export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TopoToolbar: () => import('@/community-module/alert/pages/alerttopo/alerttopo-toolbar.vue'),
    TopoEditor: () => import('@/community-module/alert/pages/alerttopo/alerttopo-editor.vue'),
    ConditionItem: () => import('@/resources/components/Condition/condition-item.vue')
  },
  props: {
    hasHeader: { type: Boolean, default: true },
    topoId: { type: Number },
    alertList: { type: Array }
  },
  data() {
    return {
      id: null,
      isShowInteractTabPane: true,
      loading: true,
      graph: null,
      dnd: null,
      topoData: { isActive: 1 },
      graphConfig: {},
      selectedNode: null,
      selectedEdge: null,
      activedEdge: null,
      currentWidget: null,
      currentWidgetId: null,
      config: {
        isSiderHide: false,
        isRightSiderHide: true,
        edgeMode: false,
        strictMode: false
      },
      alertAttrList: [],
      searchVal: {},
      searchParam: { mode: 'simple', pageSize: 500 },
      alertListLocal: []
    };
  },
  beforeCreate() {},
  created() {
    this.id = this.topoId || (this.$route.query.id && parseInt(this.$route.query.id));
    this.getAlertAttrList();
    //this.getTopoById();
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
    filterAlert() {
      const attrFilterList = [];
      for (let key in this.searchVal) {
        const val = this.searchVal[key];
        if (val !== null && val !== '') {
          let valueList = [];
          if (val instanceof Array) {
            valueList = val;
          } else {
            valueList = [val];
          }
          attrFilterList.push({ name: key, valueList: valueList });
        }
      }
      this.$api.alert.alert.searchAlert({ ...this.searchParam, attrFilterList: attrFilterList }).then(res => {
        if (res?.Return?.tbodyList) {
          const nodes = this.graph.getNodes();
          nodes.forEach(node => {
            //清除之前的alertdata工具
            node.removeTool('alertdata');
            node.setAttrByPath('body/filter', null);
            //根据alertbind注入data数据，后续根据data数据产生tools
            const setting = node.getProp('setting');
            const alertbind = setting && setting.alertbind;
            if (alertbind) {
              const displayAttr = alertbind.displayAttr;
              const filterList = alertbind.filterList;
              const bindAlertList = [];
              if (displayAttr && filterList && filterList.length > 0) {
                res.Return.tbodyList.forEach(alert => {
                  let isHit = false;
                  let alertName;
                  if (alert.attrObj) {
                    alertName = alert.attrObj[displayAttr.substr(5)]; //去掉前缀attr_
                    if (alertName != undefined && alertName != null && alertName !== '') {
                      //找到显示属性才继续，不然没意义，无法显示
                      //console.log('name', displayAttr.substr(5), alertName);
                      isHit = true;
                      for (let i = 0; i < filterList.length; i++) {
                        const filter = filterList[i];
                        const attrName = filter.attr.substr(5); //去掉前缀attr_
                        //console.log('attrname', attrName, alert.attrObj[attrName], filter.value);
                        if (alert.attrObj[attrName] && filter.value && filter.value.length > 0) {
                          //console.log('filter compare', filter.value, filter, alert.attrObj[attrName]);
                          if (!filter.value.some(val => val.toLowerCase() === String(alert.attrObj[attrName]).toLowerCase())) {
                            isHit = false;
                            break;
                          }
                        } else {
                          isHit = false;
                        }
                      }
                    }
                  }
                  if (isHit && alertName) {
                    bindAlertList.push({ id: alert.id, name: alertName, level: alert.alertLevel });
                  }
                });
              }
              if (bindAlertList.length > 0) {
                node.setData({ alertListLocal: bindAlertList });
                this.addAlertData(node);
              }
            }
          });
        }
      });
    },
    addAlertData(node) {
      //console.log('data', node.getData());
      const data = node.getData();
      if (data.alertListLocal && data.alertListLocal.length > 0) {
        let index = 0;
        let hasMore = data.alertListLocal.length > 5;
        let maxLevelColor;
        let maxLevel = 0;
        for (let i = 0; i < data.alertListLocal.length; i++) {
          const alert = data.alertListLocal[i];
          if (alert.level) {
            if (alert.level.level > maxLevel) {
              maxLevel = alert.level.level;
              maxLevelColor = alert.level.color;
            }
          }
        }
        for (let i = 0; i < data.alertListLocal.length; i++) {
          const markup = [];
          if (index > 4) {
            markup.push({
              tagName: 'text',
              textContent: '......',
              selector: 'name',
              attrs: {
                'font-size': 10,
                'text-anchor': 'left',
                'pointer-events': 'none'
              }
            });
            node.addTools([
              {
                name: 'alertdata',
                args: {
                  markup: markup,
                  x: 0,
                  y: 0,
                  offset: { x: 0, y: -8 }
                }
              }
            ]);
            break;
          } else {
            const alert = data.alertListLocal[i];
            if (alert.level) {
              markup.push({
                tagName: 'text',
                textContent: alert.level.label,
                selector: 'name',
                attrs: {
                  'font-size': 10,
                  style: 'fill:' + alert.level.color,
                  'text-anchor': 'left',
                  'pointer-events': 'none'
                }
              });
            }
            markup.push({
              tagName: 'text',
              textContent: alert.name,
              selector: 'text',
              attrs: {
                style: 'font-weight:bold',
                'font-size': 10,
                'text-anchor': 'left',
                'pointer-events': 'none',
                x: alert.level ? alert.level.label.length * 10 + 2 : 0
              }
            });
            node.addTools([
              {
                name: 'alertdata',
                args: {
                  markup: markup,
                  x: 0,
                  y: 0,
                  offset: { x: 0, y: -5 - index * 12 - (hasMore ? 12 : 0) }
                }
              }
            ]);
          }

          index++;
        }
        node.setAttrByPath('body/filter', {
          name: 'outline',
          args: {
            color: maxLevelColor || 'orange',
            width: 8,
            margin: 0,
            opacity: 0.2
          }
        });
      }
    },
    getAttrByName(name) {
      return this.alertAttrList.find(item => item.name === name);
    },
    getAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.alertAttrList = res.Return;
      });
    },
    fullscreen() {
      let fullDiv = this.$refs['graph'];
      if (screenfull.isEnabled) {
        screenfull.request(fullDiv);
      }
    },
    getTopoById() {
      if (this.id) {
        this.loading = true;
        this.$api.alert.topo
          .getTopoById(this.id)
          .then(res => {
            this.topoData = res.Return;
            if (this.topoData) {
              this.graphConfig = this.topoData?.config?.config || {};
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
    ready(graph, dnd) {
      this.graph = graph;
      this.dnd = dnd;
      if (this.topoData) {
        const { graph = {} } = this.topoData.config || {};
        this.graph.fromJSON(this.topoData?.config?.graph || {});
      }
    },
    renderDone({ graph }) {
      setTimeout(() => {
        graph.zoomToFit({ maxScale: 1, padding: 10 });
      }, 500);
    }
  },
  filter: {},
  computed: {
    searchConfig() {
      const config = {
        search: false,
        labelPosition: 'top',
        searchList: []
      };
      if (this.alertAttrList && this.alertAttrList.length > 0) {
        this.alertAttrList.forEach(attr => {
          if (this.graphConfig && this.graphConfig.filterAttrList && this.graphConfig.filterAttrList.some(d => d === attr.name)) {
            config.searchList.push({
              type: 'slot',
              name: attr.name,
              label: attr.label
            });
          }
        });
      }
      return config;
    }
  },
  watch: {
    alertList: {
      handler(val) {
        if (val) {
          this.alertListLocal = val;
        }
      },
      immediate: true
    },
    topoId: {
      handler(val) {
        if (val) {
          this.id = val;
        }
      },
      immediate: true
    },
    id: {
      handler(val) {
        if (val) {
          this.getTopoById();
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="less"></style>
