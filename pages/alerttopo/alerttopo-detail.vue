<template>
  <TsContain :hasContentPadding="false">
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
              :edgeType="activedEdge"
              :edgeMode="config.edgeMode"
              :strictMode="config.strictMode"
              @ready="ready"
              @node:selected="nodeSelected"
              @node:unselected="nodeUnSelected"
              @edge:selected="edgeSelected"
              @edge:unselected="edgeUnSelected"
              @render:done="renderDone"
              @edge:mode:change="edgeModeChange"
              @strict:mode:change="strictModeChange"
              @edge:router:change="edgeRouterChange"
            ></TopoEditor>
          </div>
        </template>
      </TsContain>
    </template>
  </TsContain>
</template>
<script>
import screenfull from '@/resources/assets/js/screenfull.js';
import { ElementFactory } from '@/commercial-module/alert/pages/alerttopo/elements/core/ElementFactory.js';

export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TopoToolbar: () => import('@/commercial-module/alert/pages/alerttopo/alerttopo-toolbar.vue'),
    TopoEditor: () => import('@/commercial-module/alert/pages/alerttopo/alerttopo-editor.vue'),
    ConditionItem: () => import('@/resources/components/Condition/condition-item.vue')
  },
  props: {},
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
      searchParam: { mode: 'simple', pageSize: 500 }
    };
  },
  beforeCreate() {},
  created() {
    this.id = this.$route.query.id && parseInt(this.$route.query.id);
    this.getAlertAttrList();
    this.getTopoById();
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
                node.setData({ alertList: bindAlertList });
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
      node.removeTool('alertdata');
      if (data.alertList && data.alertList.length > 0) {
        let index = 0;
        let hasMore = data.alertList.length > 5;
        for (let i = 0; i < data.alertList.length; i++) {
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
            const alert = data.alertList[i];
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
    saveTopo() {
      if (this.$refs.name && this.$refs.name.valid()) {
        //先清空所有选中
        this.graph.cleanSelection();
        const graphData = this.graph.toJSON();
        this.topoData.config = { config: this.graphConfig, graph: graphData };
        console.log(JSON.stringify(this.topoData, null, 2));
        this.$api.alert.topo.saveTopo(this.topoData).then(res => {
          if (res.Status === 'OK') {
            this.$Message.success(this.$t('message.savesuccess'));
          }
        });
      }
    },
    ready(graph, dnd) {
      this.graph = graph;
      this.dnd = dnd;
      if (this.topoData) {
        const { graph = {} } = this.topoData.config || {};
        const { cells = [] } = graph || {};
        if (this.isShowInteractTabPane) {
          cells.forEach(item => {
            // 每次重新渲染都需要设置不可允许拖拽大小
            if (item && item.setting && item.setting.resizable) {
              item.setting.resizable = false;
            }
            if (item && item.type == 'cmdb' && item.shape == 'edge') {
              if (item.attrs && item.attrs.line && item.attrs.line.stroke) {
                item.attrs.line.class = '';
                item.attrs.line.fill = 'none';
                if (item.attrs.line.targetMarker) {
                  item.attrs.line.targetMarker.class = '';
                  item.attrs.line.targetMarker.fill = item.attrs.line.stroke;
                }
                if (item.attrs.line.sourceMarker) {
                  item.attrs.line.sourceMarker.class = '';
                  item.attrs.line.sourceMarker.fill = item.attrs.line.stroke;
                }
              }
            }
          });
        }
        this.graph.fromJSON(this.topoData?.config?.graph || {});
      }
    },
    updateWidgetSetting(widgetId, settings) {
      const node = this.graph.getCellById(widgetId);
      if (node) {
        node.setProp('setting', settings);
      }
    },
    updateWidgetData(widgetId, data) {
      const node = this.graph.getCellById(widgetId);
      if (node) {
        node.replaceData(data);
      }
    },
    handleDrag() {
      if (this.config && this.config.edgeMode) {
        this.config.edgeMode = false;
      }
    },
    edgeModeChange(edgeMode) {
      this.config.edgeMode = !!edgeMode;
    },
    strictModeChange(strictMode) {
      this.config.strictMode = !!strictMode;
    },
    edgeRouterChange(edge) {
      this.selectedEdge = null;
      this.$nextTick(() => {
        this.selectedEdge = edge;
      });
    },
    nodeUnSelected() {
      //由于nodeslect用nextTick封装了，这里也需要封装，否则有可能会导致执行顺序错乱
      this.$nextTick(() => {
        this.currentWidgetId = null;
        this.currentWidget = null;
        this.selectedNode = null;
        this.config.isRightSiderHide = true;
      });
    },
    nodeSelected(widget, node) {
      const widgetName = node.getProp('widgetName');
      const w = ElementFactory.getElement(widget.name);
      //config不会写入节点，而是每次都从最新数据获取，这样旧图也能应用新的配置

      //const widgetData = widgetName && this.allWidgetList.find(d => d.name === widgetName);
      if (w) {
        this.$api.alert.topo.getWidgetByName(widgetName).then(res => {
          const widgetData = res.Return;
          if (widgetData) {
            w.setting = widget.setting;
            w.data = widget.data;
            //替换原element的config为组件配置的config内容
            w.config = (widgetData && widgetData.config) || {};
            this.currentWidgetId = null;
            this.currentWidget = null;
            this.$nextTick(() => {
              this.currentWidgetId = widget.id;
              this.currentWidget = w;
              this.selectedNode = node;
              this.selectedEdge = null;
              this.config.isRightSiderHide = false;
            });
          }
        });
      }
    },
    edgeSelected(edge) {
      this.currentWidgetId = null;
      this.currentWidget = null;
      this.selectedNode = null;
      this.selectedEdge = null;
      this.$nextTick(() => {
        this.selectedEdge = edge;
        this.config.isRightSiderHide = false;
      });
    },
    edgeUnSelected(edge) {
      this.selectedEdge = null;
      this.config.isRightSiderHide = true;
    },
    renderDone({ graph }) {
      const nodes = graph.getNodes();
      const widgetList = [];
      nodes.forEach(node => {
        const prop = node.prop();
        if (prop.type === 'cmdb' && prop.widgetName && node.getData() && node.getData()['ciEntityId']) {
          widgetList.push({ id: node.id, widgetName: prop.widgetName, ciEntityId: node.getData()['ciEntityId'] });
        }
      });
      if (widgetList.length > 0) {
        let updateCount = 0;
        let msg = '';
        this.$api.diagram.widget.getWidgetCiEntityName(widgetList).then(res => {
          const ciEntityList = res.Return;
          if (ciEntityList && ciEntityList.length > 0) {
            ciEntityList.forEach(ciEntity => {
              const node = graph.getCellById(ciEntity.id);
              if (node) {
                const data = node.getData();
                if (data.ciEntityName !== ciEntity.ciEntityName) {
                  msg += '<div><span>' + data.ciEntityName + '</span><span class="mr-xs ml-xs tsfont-drop-right text-grey"></span><span>' + ciEntity.ciEntityName + '</span></div>';
                  data.ciEntityName = ciEntity.ciEntityName;
                  node.setData(data);
                  updateCount += 1;
                }
              }
            });
          }
          if (updateCount > 0) {
            this.$Notice.info({ title: '自动更新了 ' + updateCount + ' 个图元名称', desc: msg });
          }
        });
      }
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
  watch: {}
};
</script>
<style lang="less"></style>
