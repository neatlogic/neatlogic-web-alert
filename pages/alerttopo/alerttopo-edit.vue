<template>
  <TsContain :hasContentPadding="false">
    <template v-slot:navigation>
      <span v-if="$hasBack()" class="tsfont-left text-action" @click="$back()">{{ $getFromPage() }}</span>
    </template>
    <template v-slot:topLeft>
      <div class="action-group">
        <div class="action-item">
          <TsFormInput
            ref="name"
            v-model="topoData.name"
            :width="450"
            :validateList="[{ name: 'required', message: ' ' }]"
            border="border"
          ></TsFormInput>
        </div>
        <div class="action-item">
          <TsFormSwitch
            v-model="topoData.isActive"
            :showStatus="true"
            :trueValue="1"
            :falseValue="0"
            :trueText="$t('page.enable')"
            :falseText="$t('page.enable')"
          ></TsFormSwitch>
        </div>
      </div>
    </template>
    <template v-slot:topRight>
      <div class="action-group">
        <div class="action-item">过滤属性</div>
        <div class="action-item">
          <TsFormSelect
            v-model="graphConfig.filterAttrList"
            :dataList="alertAttrList"
            transfer
            multiple
            valueName="name"
            textName="label"
            border="border"
            :width="250"
          ></TsFormSelect>
        </div>
        <div class="action-item">
          <Button type="primary" @click="saveTopo()">{{ $t('page.save') }}</Button>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div style="height: 34px">
        <TopoToolbar
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
        <template v-slot:sider>
          <div class="pr-md pt-md">
            <WidgetPanel :dnd="dnd" :graph="graph" @drag="handleDrag"></WidgetPanel>
          </div>
        </template>
        <template v-slot:right>
          <div class="pl-md pt-md">
            <ElementConfig
              v-if="currentWidget && currentWidgetId"
              :id="currentWidgetId"
              mode="graph"
              :ciId="topoData.ciId"
              :element="currentWidget"
              :cell="selectedNode"
              :graph="graph"
              :isShowInteractTabPane="isShowInteractTabPane"
              @setting:update="updateWidgetSetting"
              @data:update="updateWidgetData"
            ></ElementConfig>
            <EdgeConfig v-else-if="selectedEdge" :edge="selectedEdge" :graph="graph"></EdgeConfig>
            <GraphConfig v-else :config="graphConfig" :graph="graph"></GraphConfig>
          </div>
        </template>
        <template v-slot:content>
          <div ref="graph" style="height: 100%">
            <TopoEditor
              :config="graphConfig"
              :muted="true"
              mode="graph"
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
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TopoToolbar: () => import('@/commercial-module/alert/pages/alerttopo/alerttopo-toolbar.vue'),
    TopoEditor: () => import('@/commercial-module/alert/pages/alerttopo/alerttopo-editor.vue'),
    GraphConfig: () => import('@/commercial-module/alert/pages/alerttopo/elements/config/graph-config.vue'),
    ElementConfig: () => import('@/commercial-module/alert/pages/alerttopo/elements/config/element-config.vue'),
    EdgeConfig: () => import('@/commercial-module/alert/pages/alerttopo/elements/config/edge-config.vue'),
    WidgetPanel: () => import('@/commercial-module/alert/pages/alerttopo/widget-panel.vue')
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
      alertAttrList: []
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
        this.$api.alert.topo.getTopoById(this.id).then(res => {
          this.topoData = res.Return;
          if (this.topoData) {
            this.graphConfig = this.topoData?.config?.config || {};
          }
        }).finally(() => {
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
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
