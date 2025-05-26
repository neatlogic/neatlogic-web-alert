<template>
  <div ref="diagramEditorRef" :style="{ height: height || '100%', width: width || '100%' }" style="position: relative">
    <div ref="container" class="graph-main" :class="{ transition: !!transition }"></div>
    <div
      v-if="showMinimap"
      ref="minimap"
      class="shadow radius-md bg-grey"
      style="position: absolute; z-index: 2; bottom: 10px; right: 10px; width: 300px; height: 200px"
    ></div>
    <RightClickMenu
      :isVisible="isRightClickMenuVisible"
      :x="rightClickX"
      :y="rightClickY"
      :menu-list="rightClickMenuList"
      @menu-click="handleRightClickMenuClick"
    />
  </div>
</template>
<script>
import { Graph, Shape } from '@antv/x6';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { register } from '@antv/x6-vue-shape';
import { Selection } from '@antv/x6-plugin-selection';
import { Transform } from '@antv/x6-plugin-transform';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Snapline } from '@antv/x6-plugin-snapline';
import { History } from '@antv/x6-plugin-history';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { Export } from '@antv/x6-plugin-export';
import { MiniMap } from '@antv/x6-plugin-minimap';
import elements from '@/commercial-module/alert/pages/alerttopo/elements/view/shape/index.js';
import { ElementFactory } from '@/commercial-module/alert/pages/alerttopo/elements/core/ElementFactory.js';
import TopoUtil from '@/commercial-module/alert/pages/alerttopo/topo-util.js';
import RightClickMenu from '@/commercial-module/alert/pages/alerttopo/right-click-menu.vue';
export default {
  name: '',
  components: {
    RightClickMenu
  },
  props: {
    graphData: { type: Object }, //存放架构图级的用户数据
    mode: { type: String, default: 'graph' }, //graph|widget|template三种模式
    muted: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    resizable: { type: Boolean, default: false },
    grid: { type: Boolean, default: true },
    panning: { type: Boolean, default: true },
    transition: { type: Boolean, default: false }, //开启后transform会有过渡动画
    config: {
      //画布的配置，和x6数据结构无关
      type: Object,
      default: () => {
        return {};
      }
    },
    height: { type: String },
    width: { type: String },
    strictMode: { type: Boolean, default: false }, //严格框选模式
    edgeMode: { type: Boolean, default: false },
    edgeType: { type: Boolean }, //连线类型
    showMinimap: { type: Boolean, default: false }
  },
  data() {
    return {
      miniMap: null,
      selectedCell: null,
      selectedEdge: null,
      ctrlPressed: false, //是否按住ctrl/command
      drawingEdge: null,
      isDrawingLine: false,
      autoSelect: false, //激活添加时自动选中
      fromCiIdList: [], //连线上游支持的模型,edgeType不为空时需要校验
      toCiIdList: [], //连线下游支持的模型,edgeType不为空时需要校验
      hasCopy: false, // 是否有复制的节点，用于判断右键空白处时，是否显示【在此粘贴】菜单
      canDragCanvas: false, // 是否可以拖拽画布
      canRubberbandSelection: false, // 是否可以框选
      canUndo: false, // 是否可以撤销
      defaultEdgeMode: this.edgeMode || false,
      defaultStrictMode: (!!this.strictMode) || false,
      isRightClickMenuVisible: false,
      isEmitEdgeRouterChange: false,
      rightClickX: 0,
      rightClickY: 0,
      rightClickMenuList: [],
      nodeRightClickMenuList: [
        { text: this.$t('page.delete'), value: 'delete', hotkey: 'Backspace/Delete', groupName: 'clipboardOperation' },
        { text: this.$t('page.copy'), value: 'copy', hotkey: 'Ctrl/Cmd+C', groupName: 'clipboardOperation' },
        { text: this.$t('page.paste'), value: 'paste', hotkey: 'Ctrl/Cmd+V', groupName: 'clipboardOperation' },
        { text: '移至最前', value: 'toFront', isShowSelectedIcon: false },
        { text: '移至最后', value: 'toBack', isShowSelectedIcon: false },
        { text: '上移一层', value: 'moveUpOneLayer', isShowSelectedIcon: false },
        { text: '下移一层', value: 'moveDownOneLayer', isShowSelectedIcon: false }
      ],
      blankRightClickMenuList: [
        { text: this.$t('page.pastehere'), value: 'paste' }
      ],
      undoRightClickMenuList: [
        { text: this.$t('page.revocation'), value: 'undo', hotkey: 'ctrl/cmd+z' }
      ],
      commonRightClickMenuList: [
        { text: this.$t('page.selectall'), value: 'selectAll', hotkey: 'Ctrl/Cmd+A', isSingleSelection: true, groupName: 'canvasInteractionOperation'},
        { text: this.$t('page.rubberband'), value: 'rubberbandSelection', isSingleSelection: true, groupName: 'canvasInteractionOperation' },
        { text: this.$t('page.dragthecanvas'), value: 'dragCanvas', isSingleSelection: true, groupName: 'canvasInteractionOperation' },
        { text: this.$t('term.diagram.edgemode'), value: 'edgeMode' },
        { text: this.$t('term.diagram.strictmode'), value: 'strictMode' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.registElement();
  },
  beforeMount() {},
  mounted() {
    this.init();
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    handleRightClickMenuClick(item) {
      this.isRightClickMenuVisible = false;
      const { value = '' } = item || {};
      if (value == 'delete') {
        this.deleteNode();
        this.deleteEdge();
      } else if (value == 'copy') {
        this.handleCopy();
      } else if (value == 'paste') {
        this.handlePaste();
      } else if (value == 'toFront') {
        this.toFront();
      } else if (value == 'toBack') {
        this.toBack();
      } else if (value == 'selectAll') {
        this.handleSelectAll();
      } else if (value == 'dragCanvas') {
        this.handleDragCanvas();
      } else if (value == 'rubberbandSelection') {
        this.handleRubberbandSelection();
      } else if (value == 'undo') {
        this.undo();
      } else if (value == 'edgeMode') {
        this.handleEdgeMode();
      } else if (value == 'strictMode') {
        this.handleStrictMode();
      }
      this.rightClickX = 0;
      this.rightClickY = 0;
    },
    handleStrictMode() {
      this.canDragCanvas = false;
      this.graph.disablePanning();
      this.canRubberbandSelection = true;
      this.graph.enableRubberband();
      this.defaultStrictMode = !this.defaultStrictMode;
      this.$emit('strict:mode:change', this.defaultStrictMode);
    },
    handleEdgeMode() {
      this.canRubberbandSelection = false;
      this.graph.disableRubberband();
      this.defaultEdgeMode = !this.defaultEdgeMode;
      this.$emit('edge:mode:change', this.defaultEdgeMode); 
    },
    hideRightClickMenu() {
      this.isRightClickMenuVisible = false;
      this.rightClickX = 0;
      this.rightClickY = 0; 
    },
    deleteNode() {
      if (this.selectedCell) {
        this.selectedCell.remove();
      }
    },
    deleteEdge() {
      if (this.selectedEdge) {
        this.selectedEdge.remove();
      }
    },
    handleCopy() {
      this.graph.cleanClipboard();
      const cells = this.graph.getSelectedCells();
      if (cells && cells.length) {
        this.graph.copy(cells, { deep: false });
        this.$Message.success(this.$t('message.copysuccess'));
      }
      this.hasCopy = true;
    },
    handlePaste() {
      if (!this.graph.isClipboardEmpty()) {
        this.graph.cleanSelection();
        this.graph.startBatch('paste');
        const cells = this.graph.paste();
        const newCells = [];
        const x = this.rightClickX;
        const y = this.rightClickY;
        /* 
         graphToLocal：将画布坐标转换为画布本地坐标
         解决：随着画布的缩放和平移，粘贴的坐标位置不正确的问题
        */
        const p = this.graph.graphToLocal({ x: x, y: y });
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
            c.position(p.x, p.y); // 粘贴时，将节点粘贴到鼠标位置
            newCells.push(c);
          }
        });
        this.graph.stopBatch('paste');
        this.graph.select(newCells);
      }
    },
    handleSelectAll() {
      const allCells = this.graph.getCells();
      this.graph.select(allCells);
    },
    handleDragCanvas() {
      this.defaultStrictMode = false;
      this.$emit('strict:mode:change', false);
      this.canRubberbandSelection = false;
      this.graph.disableRubberband();
      this.canDragCanvas = true;
      this.graph.enablePanning();
    },
    handleRubberbandSelection(isNeedClearStrictMode = true) {
      this.canDragCanvas = false;
      this.graph.disablePanning();
      if (this.defaultStrictMode && isNeedClearStrictMode) {
        this.defaultStrictMode = false;
        this.$emit('strict:mode:change', false);
      }
      this.canRubberbandSelection = true;
      this.graph.enableRubberband();
    },
    enablePanning() {
      if (this.panning || this.canDragCanvas) {
        this.graph.enablePanning(); 
      }
    },
    disablePanning() {
      this.graph.disablePanning();
    },
    handleClickDistance(e) {
      // 获取点击距离
      const element = this.$refs.diagramEditorRef;
      let leftDistance = 0;
      let topDistance = 0;
      if (element) {
        const rect = element.getBoundingClientRect();
        leftDistance = rect.left;
        topDistance = rect.top;
      }
      this.rightClickX = e.clientX - leftDistance + 10;
      this.rightClickY = e.clientY - topDistance + 20;
      this.isRightClickMenuVisible = true; 
    },
    toBack() {
      if (this.selectedCell) {
        this.selectedCell.toBack();
      }
    },
    toFront() {
      if (this.selectedCell) {
        this.selectedCell.toFront();
      }
    },
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
    handlePasteData() {
      if (!this.graph.isClipboardEmpty()) {
        let newCells = [];
        const cells = this.graph.paste({ offset: 32 });
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
        this.graph.cleanSelection();
        this.graph.select(newCells);
      }
    },
    removeSelectedCells() {
      const cells = this.graph.getSelectedCells();
      if (cells && cells.length > 0) {
        this.graph.removeCells(cells);
      }
    },
    removeVerticesTools() {
      const edges = this.graph.getEdges();
      if (edges && edges.length > 0) {
        edges.forEach(edge => {
          edge.removeTool('vertices');
        });
      }
    },
    getGraph() {
      return this.graph;
    },
    registElement() {
      elements.forEach(element => {
        if (!element.isVue) {
          Graph.registerNode(element.name, element.config, true);
        } else {
          register(element.config);
        }
      });
      //注册连线文字filter
      Graph.registerFilter(
        'lineText',
        () => {
          return `<filter x="0" y="0" width="1" height="1">
        <feFlood class="linktextbackground" flood-opacity="1"></feFlood>
        <feComposite in="SourceGraphic" operator="over"></feComposite>
        </filter>`;
        },
        true
      );
    },
    clearHighlight() {
      this.graph.getCells().forEach(cell => {
        this.unHighlightNode(cell);
      });
    },
    unHighlightNode(nodeId) {
      const node = this.graph.getCellById(nodeId);
      if (!node) {
        return;
      }
      if (node.getAttrs()['fo']) {
        node.setAttrByPath('fo/filter', null);
      } else if (node.getAttrs()['body']) {
        node.setAttrByPath('body/filter', null);
      } else if (node.getAttrs()['line']) {
        node.setAttrByPath('line/filter', null);
      }
    },
    highlightNode(nodeId, color) {
      const node = this.graph.getCellById(nodeId);
      if (!node) {
        return;
      }
      this.unHighlightNode(nodeId);
      if (node.getAttrs()['fo']) {
        node.setAttrByPath('fo/filter', {
          name: 'outline',
          args: {
            color: color,
            width: 10,
            margin: 0,
            opacity: 0.2
          }
        });
      } else if (node.getAttrs()['body']) {
        node.setAttrByPath('body/filter', {
          name: 'outline',
          args: {
            color: color,
            width: 10,
            margin: 0,
            opacity: 0.2
          }
        });
      } else if (node.getAttrs()['line']) {
        node.setAttrByPath('line/filter', {
          name: 'outline',
          args: {
            color: color,
            width: 10,
            margin: 0,
            opacity: 0.2
          }
        });
      }
    },
    highlightEdge(edge, action) {
      if (edge && edge.isEdge()) {
        edge.setAttrByPath('line/class', 'line-' + action);
        edge.setAttrByPath('line/targetMarker/class', 'marker-' + action);
      }
    },
    unHighlightEdge(edge) {
      if (edge && edge.isEdge()) {
        const edgeClass = edge.getAttrByPath('line/stroke');
        if (edgeClass) {
          edge.setAttrByPath('line/class', edgeClass);
          edge.setAttrByPath('line/targetMarker/class', edgeClass);
        } else {
          edge.setAttrByPath('line/class', 'line');
          edge.setAttrByPath('line/targetMarker/class', 'marker');
        }
      }
    },
    drawEdge(e) {
      const x = e.clientX;
      const y = e.clientY;
      const p = this.graph.clientToLocal({ x: x, y: y });
      this.drawingEdge.setTarget(p);
      this.drawingEdge.show();
    },
    resizeNode(node) {
      let parent = node.getParent();
      //重做和撤回时，不要计算父节点大小
      while (!this.graph.undoing && !this.graph.redoing && parent && parent.isNode()) {
        const embedpadding = parent.getProp('setting')['embedpadding'] || [10, 10, 10, 10];
        let originSize = parent.prop('originSize');
        if (originSize == null) {
          originSize = parent.getSize();
          parent.prop('originSize', originSize);
        }

        let originPosition = parent.prop('originPosition');
        if (originPosition == null) {
          originPosition = parent.getPosition();
          parent.prop('originPosition', originPosition);
        }
        let x = originPosition.x;
        let y = originPosition.y;
        let cornerX = originPosition.x + originSize.width;
        let cornerY = originPosition.y + originSize.height;
        let hasChange = false;

        const children = parent.getChildren();
        if (children) {
          children.forEach(child => {
            const bbox = child.getBBox();
            const corner = bbox.getCorner();
            if (bbox.x - embedpadding[3] < x) {
              x = bbox.x - embedpadding[3];
              hasChange = true;
            }

            if (bbox.y - embedpadding[0] < y) {
              y = bbox.y - embedpadding[0];
              hasChange = true;
            }

            if (corner.x + embedpadding[1] > cornerX) {
              cornerX = corner.x + embedpadding[1];
              hasChange = true;
            }

            if (corner.y + embedpadding[2] > cornerY) {
              cornerY = corner.y + embedpadding[2];
              hasChange = true;
            }
          });
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y }
            },
            { skipParentHandler: true }
          );
          parent = parent.getParent();
        } else {
          break;
        }
      }
    },
    init: function() {
      if (!this.graph) {
        let graphConfig = {
          container: this.$refs['container'],
          snapline: true,
          background: this.config.background,
          zoomAtMousePosition: true,
          autoResize: true, //自动延伸画布
          panning: this.panning || this.canDragCanvas,
          mousewheel: {
            enabled: true, //滚动缩放
            modifiers: ['ctrl']
          },
          grid: {
            visible: this.grid,
            type: 'dot'
          },
          interacting: cellView => {
            if (this.readonly) {
              //禁止拖动
              //return true;
              return {
                nodeMovable: false, // 节点是否可以被移动
                magnetConnectable: false, // 当在具有 'magnet' 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
                edgeMovable: false, // 边是否可以被移动。
                edgeLabelMovable: false, // 边的标签是否可以被移动。
                arrowheadMovable: false, // 边的起始/终止箭头是否可以被移动。
                vertexMovable: false, // 边的路径点是否可以被移动。
                vertexAddable: false, // 是否可以添加边的路径点。
                vertexDeletable: false // 边的路径点是否可以被删除
              };
            } else {
              if (!this.edgeMode) {
                if (!cellView.cell.getProp('setting')) {
                  return { nodeMovable: true };
                } else {
                  return { nodeMovable: !!cellView.cell.getProp('setting')['draggable'] };
                }
              } else {
                return { nodeMovable: !this.edgeMode };
              }
            }
          },
          connecting: {
            // 配置全局的连线规则
            allowMulti: false, // 是否允许在相同的起始节点和终止之间创建多条边
            allowNode: true, // 是否允许边链接到节点（非节点上的链接桩）
            allowBlank: false, // 是否允许连接到空白点
            allowLoop: true, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点，
            allowEdge: false,
            connector: {
              name: 'rounded',
              args: {
                radius: 8
              }
            },
            snap: {
              radius: 20
            },
            connectionPoint: {
              name: 'boundary',
              args: {
                sticky: true
              }
            },
            createEdge: () => {
              const edge = new Shape.Edge({
                router: {
                  name: this.config?.connecting?.router || 'normal'
                },
                attrs: {
                  line: {
                    class: 'line',
                    strokeWidth: 2,
                    sourceMarker: {
                      class: 'marker',
                      name: null,
                      width: 12,
                      height: 8
                    },
                    targetMarker: {
                      class: 'marker',
                      name: 'classic',
                      width: 12,
                      height: 8
                    }
                  }
                },
                zIndex: 0
              });
              return edge;
            },
            validateConnection({ targetMagnet }) {
              return !!targetMagnet;
            }
          },
          //组合设置
          embedding: {
            enabled: true,
            //这里和api讲的不一样，需要返回空数组
            findParent: ({ view, node }) => {
              // 获取移动节点的包围盒
              const bbox = node.getBBox();
              const parentList = [];
              const parentNodeList = this.graph.getNodes().filter(d => node.id != d.id && d.getProp('setting') && d.getProp('setting')['children'] && (d.getProp('setting')['children'].includes('*') || d.getProp('setting')['children'].includes(node.shape)));
              if (parentNodeList.length > 0) {
                for (let i = 0; i < parentNodeList.length; i++) {
                  //p.toBack();
                  const p = parentNodeList[i];
                  const targetBBox = p.getBBox();
                  if (targetBBox.x < bbox.x && targetBBox.x + targetBBox.width > bbox.x + bbox.width && targetBBox.y < bbox.y && targetBBox.y + targetBBox.height > bbox.y + bbox.height) {
                    parentList.push(p);
                    //node.setProp('parentId', p.id);
                  }
                }
              }
              return parentList;
            }
          },
          translating: {
            restrict: cellView => {
              const cell = cellView.cell;
              const parentId = cell.getParentId(); //cell.getProp('parentId');
              if (parentId) {
                const parentNode = this.graph.getCellById(parentId);
                if (parentNode) {
                  const element = ElementFactory.getElement(parentNode.shape);
                  if (element && element.restrict) {
                    return element.restrict(parentNode);
                  }
                }
              }
              return false;
            }
          }
          //width: 800,
          //height: 300
        };
        this.graph = new Graph(graphConfig);
        if (!this.readonly) {
          this.graph.use(
            new History({
              enabled: true,
              beforeAddCommand: (event, arg) => {
                //console.log(event, arg);
                const cell = arg.cell;
                const key = arg.key;
                if (['tools', 'attrs'].includes(key)) {
                  return false;
                } /*else if (cell && cell.getProp('isAutofill')) {
                  return false;
                }*/
                return true;
              }
            })
          );
          this.graph.use(
            new Clipboard({
              enabled: true
            })
          );
          this.graph.use(
            new Selection({
              enabled: true,
              multiple: true,
              multipleSelectionModifiers: ['ctrl', 'meta'],
              rubberband: this.canRubberbandSelection, // 启用框选节点功能
              modifiers: [], // 框选的按键
              movable: true,
              showNodeSelectionBox: true, //显示图元的选择框
              showEdgeSelectionBox: false, //显示边的选择框
              pointerEvents: 'none',
              filter: node => {
                if (this.mode == 'template') {
                  return true;
                }
                const setting = node.getProp('setting');
                if (setting) {
                  if (setting['selectable']) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              }
            })
          );
          this.graph.use(
            new Transform({
              resizing: {
                enabled: node => {
                  const setting = node.getProp('setting');
                  if (setting) {
                    if (setting['resizable']) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    return true;
                  }
                }
              }
            })
          );
        } else if (this.resizable) {
          this.graph.use(
            new Transform({
              resizing: {
                enabled: node => {
                  const setting = node.getProp('setting');
                  if (setting) {
                    if (setting['resizable']) {
                      return true;
                    } else {
                      if (this.resizable) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  } else {
                    return true;
                  }
                }
              }
            })
          );
        }
        if (this.readonly) {
          // 只读模式下，也需要选中节点
          this.graph.use(
            new Selection({
              enabled: true,
              multiple: false,
              rubberband: false, // 不启用框选节点功能
              movable: false,
              showNodeSelectionBox: false, //显示图元的选择框
              showEdgeSelectionBox: false, //显示边的选择框
              pointerEvents: 'none',
              filter: node => {
                if (this.mode == 'template') {
                  return true;
                }
                const setting = node.getProp('setting');
                if (setting) {
                  if (setting['selectable']) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              }
            })
          );
        }
        this.graph.use(
          new Keyboard({
            enabled: true
          })
        );
        this.graph.use(
          new Snapline({
            enabled: true
          })
        );
        this.graph.use(new Export());
        this.dnd = new Dnd({
          target: this.graph,
          getDragNode: node => {
            return node.clone({
              keepId: true
            });
          },
          getDropNode: node => {
            this.autoSelect = true;
            return node.clone({
              keepId: true
            });
          }
        });
        //绑定事件
        this.graph.on('node:mousedown', ({ node, e }) => {
          if (this.edgeMode) {
            // 连线模式开启时，禁用画布平移功能，防止首次连线操作误触发画布拖拽，干扰连线功能；连线结束后，重新启用平移。
            this.graph.disablePanning();
            let canLink = false;
            //根据edgeType判断是否允许连出，edgeType不为为空，要求连出节点必须是cmdb节点，且符合相关条件
            if (node.getProp('setting') && node.getProp('setting')['linkout']) {
              if (this.edgeType) {
                //和配置项有关联的连线，只能在架构图模式下才能绘制
                if (this.mode === 'graph' && node.getData()['ciId']) {
                  if (this.fromCiIdList && this.fromCiIdList.length > 0 && this.fromCiIdList.includes(node.getData()['ciId'])) {
                    canLink = true;
                  }
                }
              } else {
                canLink = true;
              }
            }
            if (canLink) {
              this.graph.startBatch('batch-edge');
              const x = e.clientX;
              const y = e.clientY;
              const p = this.graph.clientToLocal({ x: x, y: y });
              this.drawingEdge = this.graph.addEdge({
                source: node,
                target: p,
                router: {
                  name: 'normal'
                },
                attrs: {
                  line: {
                    class: 'line',
                    connection: true,
                    strokeWidth: 1,
                    sourceMarker: {
                      class: 'marker',
                      name: null,
                      width: 12,
                      height: 8
                    },
                    targetMarker: {
                      class: 'marker',
                      name: 'classic',
                      width: 12,
                      height: 8
                    }
                  }
                },
                labels: [
                  {
                    position: {
                      distance: 0.5,
                      offset: 10
                    },
                    attrs: {
                    }
                  }
                ]
              });
              this.drawingEdge.hide();
              document.addEventListener('mousemove', this.drawEdge);
            }
          }
        });
        this.graph.on('node:mouseup', ({ node, e }) => {
          if (this.drawingEdge) {
            const x = e.clientX;
            const y = e.clientY;
            const p = this.graph.clientToLocal({ x: x, y: y });
            const nodes = this.graph.getNodesFromPoint(p.x, p.y);
            this.enablePanning();
            let targetNode = null;
            if (nodes.length > 0) {
              targetNode = nodes.sort((a, b) => {
                return b.zIndex - a.zIndex;
              })[0];
              //不能自己连线
              if (node.id === targetNode.id || !targetNode.getProp('setting') || !targetNode.getProp('setting')['linkin']) {
                targetNode = null;
              }
            }
            const edgeList = this.graph.getEdges();
            if (targetNode) {
              //检查连线是否存在
              if (edgeList.find(edge => edge.getSourceCellId() === node.id && edge.getTargetCellId() === targetNode.id)) {
                targetNode = null;
              }
            }
            let canLink = false;
            if (targetNode && this.edgeType) {
              //设置边的样式
              if (this.edgeType.config) {
                if (this.edgeType.config.color) {
                  const color = this.edgeType.config.color;
                  const text = this.edgeType.config.text;
                  this.drawingEdge.setAttrByPath('line/class', null);
                  this.drawingEdge.setAttrByPath('line/targetMarker/class', null);
                  this.drawingEdge.setAttrByPath('line/sourceMarker/class', null);
                  this.drawingEdge.setAttrByPath('line/stroke', color);
                  this.drawingEdge.setAttrByPath('line/targetMarker/fill', color);
                  this.drawingEdge.setAttrByPath('line/sourceMarker/fill', color);
                  this.drawingEdge.setAttrByPath('label/style', 'fill:' + color);
                  this.drawingEdge.setLabels({
                    attrs: {
                      label: {
                        text: text || '',
                        style: {
                          fill: color
                        },
                        fontSize: 12
                      }
                    },
                    position: {
                      distance: 0.5,
                      offset: 10
                    }
                  });
                }
                if (this.edgeType.config.type && this.edgeType.config.type === 'dash') {
                  this.drawingEdge.setAttrByPath('line/strokeDasharray', '10,6');
                }
              }
              //把数据设进边中
              this.drawingEdge.setData({
                type: this.edgeType.type,
                id: this.edgeType.id,
                name: this.edgeType.name
              });
              if (this.edgeType.type === 'rel') {
                this.drawingEdge.setData({
                  relId: this.edgeType.relId
                });
              } else if (this.edgeType.type === 'ci') {
                this.drawingEdge.setData({
                  ciId: this.edgeType.ciId,
                  fromRelId: this.edgeType.fromRelId,
                  toRelId: this.edgeType.toRelId
                });
              }
              //设置边的类型为cmdb
              this.drawingEdge.prop('type', 'cmdb');
              //和配置项有关联的连线，只能在架构图模式下才能绘制
              if (this.mode === 'graph' && targetNode.getData()['ciId']) {
                if (this.toCiIdList && this.toCiIdList.length > 0 && this.toCiIdList.includes(targetNode.getData()['ciId'])) {
                  canLink = true;
                  const fromCiEntityId = node.getData() && node.getData()['ciEntityId'];
                  const toCiEntityId = targetNode.getData()['ciEntityId'];
                  const toCiEntityName = targetNode.getData()['ciEntityName'];
                  const fromCiId = node.getData() && node.getData()['ciId'];
                  const toCiId = targetNode.getData()['ciId'];
                  //如果是CMDB关系，则补充fromCiEntityId和toCiEntityId，方便数据回显
                  this.drawingEdge.setData({
                    fromCiEntityId: fromCiEntityId,
                    toCiEntityId: toCiEntityId
                  });
                  //如果连线代表关系，直接生成relEntityData数据
                  if (this.edgeType.type === 'rel' && this.edgeType.relId) {
                    if (fromCiEntityId && toCiEntityId) {
                      const relEntityData = {};
                      relEntityData['relfrom_' + this.edgeType.relId] = {
                        valueList: [
                          {
                            ciEntityId: toCiEntityId,
                            ciEntityName: toCiEntityName,
                            ciId: toCiId
                          }
                        ]
                      };
                      this.drawingEdge.setData({
                        saveData: {
                          ciEntityList: [
                            {
                              id: fromCiEntityId,
                              ciId: fromCiId,
                              relEntityData: relEntityData,
                              editMode: 'partial'
                            }
                          ]
                        }
                      });
                    }
                  }
                }
              }
            } else {
              canLink = true;
            }

            if (targetNode && canLink) {
              this.removeVerticesTools(); // 拖拽连线时，删除连线的路径点
              this.drawingEdge.setTarget(targetNode);
              this.graph.select(this.drawingEdge);
            } else {
              this.graph.removeEdge(this.drawingEdge);
            }
            document.removeEventListener('mousemove', this.drawEdge);
            this.drawingEdge = null;
            this.graph.stopBatch('batch-edge');
          }
        });
        this.graph.on('node:mousemove', ({ node }) => {
          const edgeList = this.graph.getConnectedEdges(node);
          if (!edgeList || edgeList.length == 0) {
            return;
          }
          edgeList.forEach(edge => {
            const hasRouter = edge.getRouter();
            const hasVertices = edge.getVertices().length > 0;
            if (hasRouter && hasVertices) {
              if (edge.hasTool('vertices')) {
                edge.removeTool('vertices');
              }
              edge.setVertices([]);
            }
          });
        });
        this.graph.on('node:dblclick', ({ node }) => {
          if (!this.muted) {
            const data = node.getData();
            if (data && data.ciEntityId && data.ciId) {
              this.$emit('node:dblclick:cientity', data.ciEntityId, data.ciId);
            }
          }
        });
        this.graph.on('node:mouseenter', ({ node }) => {
          const ports = node.getPorts() || [];
          ports.forEach(port => {
            node.setPortProp(port.id, 'attrs/circle', {
              class: 'port'
            });
          });
        });
        this.graph.on('node:mouseleave', ({ node }) => {
          const ports = node.getPorts() || [];
          ports.forEach(port => {
            node.setPortProp(port.id, 'attrs/circle', {
              class: 'port hidden'
            });
          });
          this.isEmitEdgeRouterChange = false;
        });
        this.graph.on('node:selected', ({ node }) => {
          //创建改变形状选中框
          this.graph.createTransformWidget(node);
          this.$emit(
            'node:selected',
            {
              id: node.id,
              name: node.shape,
              setting: node.getProp('setting'),
              data: node.getData()
            },
            node
          );
          this.selectedCell = node;
          const edges = this.graph.getConnectedEdges(node);
          if (edges && edges.length > 0) {
            edges.forEach(e => {
              this.highlightEdge(e, 'actived');
            });
          }
        });
        this.graph.on('node:unselected', ({ node }) => {
          if (node.hasTool('button-remove')) {
            node.removeTool('button-remove');
          }
          if (this.selectedCell && this.selectedCell.id === node.id) {
            const selected = this.graph.getSelectedCells();
            if (selected.length > 0) {
              this.selectedCell = selected[selected.length - 1];
              //由于节点已经处于选中状态，不能直接调用graph.select，只能手动emit
              if (this.selectedCell.isNode()) {
                this.$emit(
                  'node:selected',
                  {
                    id: this.selectedCell.id,
                    name: this.selectedCell.shape,
                    setting: this.selectedCell.getProp('setting'),
                    data: this.selectedCell.getData()
                  },
                  this.selectedCell
                );
              } else if (this.selectedCell.isEdge()) {
                this.$emit('edge:selected', this.selectedCell);
              }
            } else {
              this.selectedCell = null;
              this.$emit('node:unselected');
            }
            this.hasCopy = false;
          }
          //取消高亮连线
          const edges = this.graph.getConnectedEdges(node);
          if (edges && edges.length > 0) {
            edges.forEach(e => {
              this.unHighlightEdge(e);
            });
          }
        });
        this.graph.on('edge:selected', ({ edge }) => {
          if (this.selectedCell && this.selectedCell.isNode()) {
            this.$emit('node:unselected');
          }
          if (edge) {
            edge.addTools({
              name: 'button',
              args: {
                markup: [
                  {
                    tagName: 'circle',
                    selector: 'button',
                    attrs: {
                      r: 6,
                      stroke: '#fe854f',
                      strokeWidth: 2,
                      fill: 'white',
                      class: 'custom-edge-button',
                      opacity: 0.4,
                      cursor: 'crosshair',
                      'pointer-events': 'auto'
                    }
                  }
                ],
                distance: 0.5,
                onClick({ e }) {
                  edge.removeTool('button');
                  edge.addTools({
                    name: 'vertices',
                    args: {
                      attrs: {
                        pointerEvents: 'auto',
                        cursor: 'crosshair',
                        class: 'custom-vertices'
                      },
                      stopPropagation: false,
                      addable: false
                    }
                  });
                  const p = this.graph.clientToLocal({ x: e.clientX, y: e.clientY });
                  edge.setVertices([
                    {
                      x: p.x,
                      y: p.y
                    }
                  ]); 
                }
              }
            });
          }
          this.selectedCell = edge;
          this.$emit('edge:selected', edge);
          this.isEmitEdgeRouterChange = false;
        });
        this.graph.on('edge:unselected', ({ edge }) => {
          this.isEmitEdgeRouterChange = false;
          if (edge.hasTool('vertices')) {
            edge.removeTool('vertices');
          }
          if (edge.hasTool('button')) {
            edge.removeTool('button');
          }
          if (this.selectedCell && this.selectedCell.id === edge.id) {
            const selected = this.graph.getSelectedCells();
            if (selected.length > 0) {
              this.selectedCell = selected[selected.length - 1];
              if (this.selectedCell.isNode()) {
                this.$emit(
                  'node:selected',
                  {
                    id: this.selectedCell.id,
                    name: this.selectedCell.shape,
                    setting: this.selectedCell.getProp('setting'),
                    data: this.selectedCell.getData()
                  },
                  this.selectedCell
                );
              } else if (this.selectedCell.isEdge()) {
                this.$emit('edge:selected', this.selectedCell);
              }
            } else {
              this.selectedCell = null;
            }
            this.$emit('edge:unselected', edge);
          }
        });
        this.graph.on('edge:mousemove', ({ edge }) => {
          this.isEmitEdgeRouterChange = true;
        });
        this.graph.on('edge:mouseleave', ({ edge }) => {
          this.isEmitEdgeRouterChange = false;
        });
        this.graph.on('edge:change:vertices', ({ edge }) => {
          if (this.isEmitEdgeRouterChange) {
            if (edge) {
              edge.removeRouter();
              this.$emit('edge:router:change', edge);
            }
          }
        });
        this.graph.on('blank:contextmenu', ({ e, x, y }) => {
          // 空白右键事件
          if (this.readonly) {
            return false;
          }
          this.commonRightClickMenuList.forEach((item) => {
            if (item.value == 'edgeMode' && this.defaultEdgeMode) {
              item.selected = true;
            } else if (item.value == 'strictMode' && this.defaultStrictMode) {
              item.selected = true;
            }
          });
          this.rightClickMenuList = [
            ...(this.hasCopy ? this.blankRightClickMenuList : []),
            ...(this.canUndo ? this.undoRightClickMenuList : []),
            ...this.commonRightClickMenuList
          ];
          this.handleClickDistance(e);
        });
        this.graph.on('history:change', () => {
          this.canUndo = this.graph.canUndo();
        });
        this.graph.on('node:contextmenu', ({ e, x, y, node }) => {
          // 节点右键事件
          if (this.readonly) {
            return false;
          }
          this.graph.unselect(this.selectedCell);
          this.selectedCell = null;
          this.graph.createTransformWidget(node);
          this.$emit(
            'node:selected',
            {
              id: node.id,
              name: node.shape,
              setting: node.getProp('setting'),
              data: node.getData()
            },
            node
          );
          this.selectedCell = node;
          const edges = this.graph.getConnectedEdges(node);
          if (edges && edges.length > 0) {
            edges.forEach(e => {
              this.highlightEdge(e, 'actived');
            });
          }
          this.graph.select(node);
          this.rightClickMenuList = this.nodeRightClickMenuList;
          this.handleClickDistance(e);
        });
        this.graph.on('node:embedding', ({ e }) => {
          this.ctrlPressed = e.metaKey || e.ctrlKey;
        });
        this.graph.on('node:embedded', async({ node, previousParent, currentParent }) => {
          //console.log('embeded', node.getParentId(), currentParent.getProp('children'));
          this.ctrlPressed = false;

          const element = ElementFactory.getElement(currentParent.shape);
          let isValid = true;
          if (element && element.embedValidate && typeof element.embedValidate === 'function') {
            isValid = await element.embedValidate(this.graphData, currentParent, node);
          }
          if (!isValid) {
            node.setParent(null);
            const children = currentParent.getProp('children');
            if (children && children.length > 0) {
              const index = children.findIndex(d => d === node.id);
              if (index > -1) {
                children.splice(index, 1);
                currentParent.setProp('children', children);
              }
            }
            //node.setProp('parentId', null);
            //console.log('remove embeded', node.getParentId(), currentParent.getProp('children'));
          }
        });
        this.graph.on('node:change:size', ({ node, options }) => {
          if (options.skipParentHandler) {
            return;
          }
          const children = node.getChildren();
          if (children && children.length) {
            node.prop('originSize', node.getSize());
          }
          this.resizeNode(node);
        });
        //自动扩展/收缩父节点
        this.graph.on('node:change:position', ({ node, options }) => {
          // 注释：当前暂时不需要此功能，即拖动节点时父节点边框随之变化的功能。
          // if (options.skipParentHandler || this.ctrlPressed || options.slient) {
          //   return;
          // }
          // const children = node.getChildren();
          // if (children && children.length) {
          //   node.prop('originPosition', node.getPosition());
          // }
          // this.resizeNode(node);
        });
        this.graph.on('node:move', () => {
          this.graph.startBatch('node-move');
        });
        this.graph.on('node:moved', ({ node }) => {
          const outEdges = this.graph.getOutgoingEdges(node);
          const inEdges = this.graph.getIncomingEdges(node);
          const edges = [];
          if (outEdges && outEdges.length > 0) {
            edges.push(...outEdges);
          }
          if (inEdges && inEdges.length > 0) {
            edges.push(...inEdges);
          }
          this.graph.stopBatch('node-move');
        });
        this.graph.on('node:change:children', ({ node }) => {
          //console.log(node);
        });
        this.graph.on('node:embed');
        this.graph.on('view:mounted', cellView => {
          this.$emit('view:mounted', this.graph, cellView);
        });
        this.graph.on('translate', ({ tx, ty }) => {
          this.$emit('translate', { graph: this.graph, tx, ty });
        });
        this.graph.on('render:done', () => {
          this.$emit('render:done', { graph: this.graph });
        });

        //让节点可以获取当前模式
        this.graph.on('custom:getDiagramData', (diagramData) => {
          diagramData.mode = this.mode;
          diagramData.readonly = this.readonly;
          diagramData.graphData = this.graphData;
        });

        const bindShortcut = (keys, callback) => {
          keys.forEach(key => {
            this.graph.bindKey(key, () => {
              if (this.readonly) {
                return false;
              }
              callback();
              this.hideRightClickMenu();
              return false;
            });
          });
        };
        bindShortcut(['ctrl+a', 'command+a'], () => this.handleSelectAll());
        bindShortcut(['ctrl+c', 'command+c'], () => this.handleCopy());
        bindShortcut(['ctrl+v', 'command+v'], () => this.handlePasteData());
        bindShortcut(['ctrl+z', 'command+z'], () => this.undo());
        bindShortcut(['ctrl+y', 'command+y'], () => this.redo());
        bindShortcut(['delete', 'backspace'], () => this.removeSelectedCells());
        /*this.graph.on('clipboard:changed', ({ cells }) => {
          console.log(cells);
          cells.forEach(d => {
            d.removeTools();
          });
        });*/

        /* this.lineTextFilterId = this.graph.defineFilter({
          name: 'lineText',
          attrs: {
            id: 'lineTextFilter',
            x: 0,
            y: 0,
            width: 1,
            height: 1
          }
        });
        console.log(this.lineTextFilterId);*/
        this.$emit('ready', this.graph, this.dnd);
      }
    }
  },
  filter: {},
  computed: {},
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
    strictMode: {
      handler: function(val) {
        this.graph.toggleStrictRubberband(!!val);
        this.defaultStrictMode = !!val;
        if (val) {
          this.handleRubberbandSelection(false);
        } else {
          this.canRubberbandSelection = false;
          this.graph.disableRubberband();
          this.canDragCanvas = true;
          this.graph.enablePanning();
        }
      }
    },
    edgeType: {
      handler: function(edge) {
        if (edge && edge.id) {
          this.$api.diagram.diagram.getCiListByEdgeType(edge.id).then(res => {
            this.fromCiIdList = res.Return.fromCiIdList || [];
            this.toCiIdList = res.Return.toCiIdList || [];
          });
        } else {
          this.fromCiIdList = [];
          this.toCiIdList = [];
        }
      },
      immediate: true,
      deep: true
    },
    edgeMode: {
      handler: function(val) {
        if (val) {
          if (this.panning) {
            this.graph.disablePanning();
            if (this.defaultStrictMode) {
              this.graph.enableRubberband();
              this.graph.toggleStrictRubberband(true);
            }
          }
        } else {
          if (this.panning && !this.canRubberbandSelection) {
            // 连线和框选互斥
            this.graph.enablePanning();
          }
        }
        this.defaultEdgeMode = val || false;
      }
    }
  }
};
</script>
<style lang="less">
@import './topo-editor.less';
</style>
<style lang="less" scoped>
@import '~@/resources/assets/css/variable.less';
.theme(@shadow-color) {
  .tool-bar {
    box-shadow: 0px 3px 4px 0px @shadow-color;
    width: 100%;
    z-index: 99;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 30px;
    padding-top: 5px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
}
html {
  .theme(@default-boxshadow-bolck);

  &.theme-dark {
    .theme(@dark-boxshadow-bolck);
  }
}
</style>
