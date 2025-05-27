import api from '@/resources/api/api.js';
import utils from '@/resources/assets/js/util.js';
import { Graph } from '@antv/x6';
import { GridLayout } from '@/commercial-module/diagram/pages/editor/grid-layout.js';
import { NodeFactory } from '@/commercial-module/diagram/pages/elements/core/NodeFactory.js';
import { AutofillTool, ClearAutofillTool } from '@/commercial-module/alert/pages/alerttopo/topo-tools.js';
const methods = {
  addAutofillTool(graph, ciEntityId, node) {
    methods.clearAutofillTool(graph, node);
    Graph.registerNodeTool('autofill', AutofillTool, true);
    Graph.registerNodeTool('clear-autofill', ClearAutofillTool, true);
    const autoFillNodes = node ? [node] : graph.getNodes().filter(d => d.getProp('setting')['autofill'] && d.getProp('setting')['autofill'].endCiId && d.getProp('setting')['autofill'].widgetId);
    autoFillNodes.forEach(d => {
      d.addTools({
        name: 'autofill',
        args: {
          x: 0,
          y: 0,
          offset: { x: 0, y: -22 },
          onClick({ cell, view }) {
            methods.clearAutofillNode(graph, d);
            methods.autofillNode(graph, ciEntityId, d);
          }
        }
      });
      d.addTools({
        name: 'clear-autofill',
        args: {
          x: 0,
          y: 0,
          offset: { x: 50, y: -22 },
          onClick({ cell, view }) {
            methods.clearAutofillNode(graph, d);
          }
        }
      });
    });
  },
  async autofillNode(graph, ciEntityId, node, searchParam) {
    searchParam = searchParam || {};
    this.clearAutofillNode(graph);
    graph.disableHistory();
    const autoFillNodes = node ? [node] : graph.getNodes().filter(d => d.getProp('setting')['autofill'] && d.getProp('setting')['autofill'].endCiId && d.getProp('setting')['autofill'].widgetId);
    for (let i = 0; i < autoFillNodes.length; i++) {
      const d = autoFillNodes[i];
      const setting = d.getProp('setting');
      const widgetId = setting.autofill.widgetId;
      const param = {
        endCiId: setting.autofill.endCiId,
        ciEntityId: setting.autofill.ciEntityId || ciEntityId,
        ciRelList: setting.autofill.ciRelList,
        attrList: [],
        dsl: setting.autofill.dsl
      };
      let widget, ciEntityList;
      await api.diagram.widget.getWidgetById(widgetId).then(res => {
        widget = res.Return;
      });
      const width = widget?.config?.prop?.width;
      const height = widget?.config?.prop?.height;
      //从mapping中提取需要查询的cientity属性
      if (!utils.isEmpty(widget.config.mapping)) {
        for (let key in widget.config.mapping) {
          if (!widget.config.mapping[key].toString().startsWith('_')) {
            param.attrList.push(widget.config.mapping[key]);
          }
        }
      }

      await api.diagram.widget.getAutofillWidgetList({ ...param, ...searchParam }).then(res => {
        ciEntityList = res.Return;
      });
      //新方式，直接给自动填充节点注入数据让其渲染html节点
      const dataList = [];
      if (ciEntityList && ciEntityList.length > 0) {
        for (let i = 0; i < ciEntityList.length; i++) {
          const cientity = ciEntityList[i];
          //不要修改原数据
          const config = utils.deepClone(widget.config) || {};
          if (!utils.isEmpty(config.mapping)) {
            for (let key in config.mapping) {
              if (config.mapping[key].toString().startsWith('_')) {
                config.data[key] = cientity[config.mapping[key].toString().substring(1)];
              } else {
                const attr = cientity.attrEntityData && cientity.attrEntityData['attr_' + config.mapping[key]];
                if (attr) {
                  config.data[key] = attr.actualValueList.join('、');
                }
              }
            }
          }
          dataList.push({
            shape: widget.shape,
            data: {
              ...config.data,
              width: width,
              height: height
            }
          });
        }
      }
      //用_autofill包裹方便识别删除
      d.setData({ _autofill: null });
      setTimeout(() => {
        d.setData({ _autofill: { ciEntityList: dataList } });
      }, 0);

      /*旧方式，直接产生图元
      if (widget && ciEntityList && ciEntityList.length > 0) {
        const newNodeList = [];
        for (let i = 0; i < ciEntityList.length; i++) {
          const cientity = ciEntityList[i];
          //不要修改原数据
          const config = utils.deepClone(widget.config) || {};
          //禁用所有连线选择等操作
          if (!config.setting) {
            config.setting = {};
          }
          config.setting.resizable = false;
          config.setting.deleteable = false;
          config.setting.draggable = false;
          config.setting.selectable = false;
          config.setting.linkin = false;
          config.setting.linkout = false;
          //根据mapping替换widget数据
          if (!utils.isEmpty(config.mapping)) {
            for (let key in config.mapping) {
              if (config.mapping[key].toString().startsWith('_')) {
                config.data[key] = cientity[config.mapping[key].toString().substring(1)];
              } else {
                const attr = cientity.attrEntityData && cientity.attrEntityData['attr_' + config.mapping[key]];
                if (attr) {
                  config.data[key] = attr.actualValueList.join('、');
                }
              }
            }
          }
          //避免同一个cientity重复出现导致id重复
          config.id = d.id + '-' + cientity.uuid;
          config.widgetName = widget.name;
          const node = NodeFactory.createNode(graph, widget.shape, config);
          //用于识别自动填充的节点
          node.prop('isAutofill', true);
          newNodeList.push(node);
        }
        const gridLayout = new GridLayout({
          parent: d,
          width: d.size().width,
          height: d.size().height,
          padding: 15
        });
        gridLayout.layout(newNodeList);
      }*/
    }
    graph.enableHistory();
  },
  clearAutofillTool(graph, node) {
    graph.disableHistory();
    if (node) {
      node.removeTool('autofill');
      node.removeTool('clear-autofill');
      node.removeTool('autofill-overflow');
    } else if (graph) {
      const nodes = graph.getNodes();
      if (nodes && nodes.length > 0) {
        nodes.forEach(n => {
          n.removeTool('autofill');
          n.removeTool('clear-autofill');
          n.removeTool('autofill-overflow');
        });
      }
    }
    graph.enableHistory();
  },
  clearAutofillNode(graph, node) {
    graph.disableHistory();
    const nodeList = node ? [node] : graph.getNodes();
    nodeList.forEach(n => {
      const children = n.getChildren();
      if (children && children.length > 0) {
        children.forEach(child => {
          if (child.getProp('isAutofill')) {
            n.removeChild(child);
          }
        });
      }
      if (n.getProp('isAutofill')) {
        graph.removeNode(n, { deep: true, slient: true });
      }
      const data = utils.deepClone(n.getData());
      delete data._autofill;
      n.setData(data, { overwrite: true });
    });
    graph.enableHistory();
  }
};

export default methods;
