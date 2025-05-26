<template>
  <div class="action-group pl-nm pr-nm pb-xs pt-xs border-base-bottom border-base-top">
    <div v-if="!readonly" class="action-item tsfont-bar" @click="config.isSiderHide = !config.isSiderHide"></div>
    <div v-if="!readonly" class="action-item" style="padding: 0px !important"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div v-if="!readonly" class="action-item">
      <TsFormSwitch
        v-model="config.edgeMode"
        :showStatus="true"
        :trueValue="true"
        :falseValue="false"
        :trueText="$t('term.diagram.edgemode')"
        :falseText="$t('term.diagram.edgemode')"
      ></TsFormSwitch>
    </div>
    <div v-if="!readonly" style="padding: 0px !important" class="action-item"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div v-if="!readonly" class="action-item">
      <TsFormSwitch
        v-model="config.strictMode"
        :showStatus="true"
        :trueValue="true"
        :falseValue="false"
        :trueText="$t('term.diagram.strictmode')"
        :falseText="$t('term.diagram.strictmode')"
      ></TsFormSwitch>
    </div>
    <div v-if="!readonly" class="action-item" style="padding: 0px !important"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div
      v-if="!readonly"
      class="action-item tsfont-undo toolbar-icon-font-size"
      title="撤销（Ctrl + Z）"
      :class="{ disable: !canUndo }"
      @click="canUndo && undo()"
    ></div>
    <div
      v-if="!readonly"
      class="action-item tsfont-revover toolbar-icon-font-size"
      :class="{ disable: !canRedo }"
      title="重做 (Ctrl + Y)"
      @click="canRedo && redo()"
    ></div>
    <div v-if="!readonly" class="action-item" style="padding: 0px !important"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div class="action-item tsfont-search-plus toolbar-icon-font-size" title="放大（Ctrl + / Ctrl + MouseWheel）" @click="graph.zoom(0.1)"></div>
    <div class="action-item tsfont-search-minus toolbar-icon-font-size" title="缩小 （Ctrl - / Ctrl + MouseWheel）" @click="graph.zoom(-0.1)"></div>
    <div class="action-item tsfont-search toolbar-icon-font-size" title="重置视图" @click="graph.zoomTo(1)"></div>
    <div class="action-item tsfont-center toolbar-icon-font-size" title="画布内容充满视口" @click="graph.zoomToFit({ padding: 10 })"></div>
    <div class="action-item tsfont-fullscreen toolbar-icon-font-size" title="全屏" @click="$emit('fullscreen')"></div>
    <div v-if="needMinimap" class="action-item ">
      <Poptip
        v-model="showMinimap" 
        title="小地图"
        placement="bottom"
        width="350"
        :transfer="true"
      >
        <span class="tsfont-circulation-o toolbar-icon-font-size" title="小地图"></span>
        <div slot="content" ref="minimap">
        </div>
      </Poptip>
    </div>
    <div v-if="!readonly && (selectedNode || selectedEdge)" class="action-item" style="padding: 0px !important"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div
      v-if="!readonly && (selectedNode || selectedEdge)"
      class="action-item tsfont-trash-o toolbar-icon-font-size"
      title="删除 (Delete / Backspace)"
      @click="deleteSelected()"
    ></div>
    <div v-if="!readonly && selectedNode" class="action-item" style="padding: 0px !important"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div
      v-if="!readonly && selectedNode"
      class="action-item tsfont-top toolbar-icon-font-size"
      :title="$t('term.diagram.tofront')"
      @click="toFront()"
    ></div>
    <div
      v-if="!readonly && selectedNode"
      class="action-item tsfont-bottom toolbar-icon-font-size"
      :title="$t('term.diagram.toend')"
      @click="toBack()"
    ></div>
    <div v-if="!readonly && selectedNode" class="action-item"><Divider type="vertical" style="margin: 0px"></Divider></div>
    <div
      v-if="!readonly && selectedNode"
      class="action-item tsfont-copy toolbar-icon-font-size"
      title="复制 (Ctrl + C)"
      @click="copy()"
    ></div>
    <div
      v-if="!readonly && selectedNode"
      class="action-item tsfont-paste toolbar-icon-font-size"
      title="粘贴 (Ctrl + V)"
      @click="paste()"
    ></div>
    <div
      v-if="!readonly"
      class="action-item tsfont-bar"
      style="float: right"
      @click="config.isRightSiderHide = !config.isRightSiderHide"
    ></div>
  </div>
</template>
<script>
import { Graph, Node, Edge } from '@antv/x6';
import { MiniMap } from '@antv/x6-plugin-minimap';
import TopoUtil from '@/commercial-module/alert/pages/alerttopo/topo-util.js';

export default {
  name: '',
  components: {
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  props: {
    mode: {
      type: String,
      required: true,
      validator(value) {
        return ['graph', 'template'].includes(value);
      }
    },
    needMinimap: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    graph: { type: Graph }, //图形实例，非数据
    selectedNode: { type: Node },
    selectedEdge: { type: Edge },
    config: { type: Object } //画布的配置，控制显示效果，不用保存
  },
  data() {
    return {
      canRedo: false,
      canUndo: false,
      isBind: false,
      isEdgeConfigShow: false,
      currentEdgeConfig: null,
      activedEdge: null,
      showMinimap: false,
      miniMap: null
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {
    this.graph.off('history:change');
  },
  destroyed() {},
  methods: {
    undo() {
      this.graph.undoing = true;
      this.graph.undo();
      this.graph.undoing = false;
    },
    redo() {
      this.graph.redoing = true;
      this.graph.redo();
      this.graph.redoing = false;
    },
    toggleEdge(edge) {
      //非模板模式下才允许切换连线类型
      if (this.mode !== 'template') {
        if (this.activedEdge === edge) {
          this.activedEdge = null;
        } else {
          this.activedEdge = edge;
        }
      }
    },
    editEdge(edge) {
      this.isEdgeConfigShow = true;
      this.currentEdgeConfig = edge;
    },
    deleteSelected() {
      if (this.selectedNode) {
        this.selectedNode.remove();
      } else if (this.selectedEdge) {
        this.selectedEdge.remove();
      }
    },
    toBack() {
      if (this.selectedNode) {
        this.selectedNode.toBack();
      }
    },
    toFront() {
      if (this.selectedNode) {
        this.selectedNode.toFront();
      }
    },
    copy() {
      const cells = this.graph.getSelectedCells();
      if (cells && cells.length) {
        this.graph.copy(cells, { deep: false });
        this.$Message.success(this.$t('message.copysuccess'));
      }
    },
    paste() {
      if (!this.graph.isClipboardEmpty()) {
        this.graph.cleanSelection();
        this.graph.startBatch('paste');
        const cells = this.graph.paste();
        const newCells = [];
        cells.forEach(cell => {
          const c = this.graph.updateCellId(cell, this.$utils.setUuid());
          if (!c.isEdge()) {
            //删除自动填充的相关数据
            TopoUtil.clearAutofillTool(this.graph, c);
            TopoUtil.clearAutofillNode(this.graph, c);
            const settings = c.getProp('setting');
            if (settings && settings.autofill && settings.autofill.endCiId && settings.autofill.widgetId) {
              TopoUtil.addAutofillTool(this.graph, null, c);
            }
            newCells.push(c);
          }
        });
        this.graph.stopBatch('paste');
        this.graph.select(newCells);
      }
    }
  },
  filter: {},
  computed: {
    showEdgeMode() {
      return !this.readonly && this.config.edgeMode;
    }
  },
  watch: {
    showMinimap: {
      handler: function(val) {
        if (this.graph) {
          if (val) {
            this.$nextTick(() => {
              this.miniMap = new MiniMap({
                container: this.$refs['minimap']
              });
              this.graph.use(this.miniMap);
            });
          } else if (this.miniMap) {
            this.miniMap.dispose();
            this.miniMap = null;
          }
        }
      }
    },
    graph: {
      handler: function(val) {
        if (val /*&& !this.isBind*/) {
          this.graph.on('history:change', () => {
            this.canRedo = this.graph.canRedo();
            this.canUndo = this.graph.canUndo();
          });
          this.isBind = true;
        }
      },
      immediate: true
    },
    activedEdge: {
      handler: function(val) {
        this.$emit('edge-change', val);
      },
      deep: true
    },
    'config.edgeMode': {
      handler(edgeMode) {
        if (edgeMode) {
          this.activedEdge = null;
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.toolbar-icon-font-size {
  font-size: 16px;
}
</style>
