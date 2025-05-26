import { ElementFactory } from './ElementFactory.js';
import $utils from '@/resources/assets/js/util.js';

const NodeFactory = {
  createNode: (graph, shape, config) => {
    const constList = ['setting', 'mapping', 'data', 'customData'];//这三个config中的属性都是单独处理，其余数据可以放进config中
    const element = ElementFactory.getElement(shape);
    if (element) {
      const nodeConfig = {
        id: (config && config.id) || $utils.setUuid(),
        shape: element.name,
        widgetName: config && config.widgetName, //记录真实的widgetName
        label: element.label,
        data: (config && config.data) || element.data
      };
      //设置组件代码中的prop
      if (element.prop) {
        for (let key in element.prop) {
          nodeConfig[key] = element.prop[key];
        }
      }
      //用组件配置数据中的prop覆盖组件代码中的prop
      if (config && config.prop) {
        for (let key in config.prop) {
          nodeConfig[key] = config.prop[key];
        }
      }

      //设置组件代码中的setting
      if (element.setting) {
        nodeConfig.setting = element.setting;
      }

      //用组件配置数据中的setting覆盖组件代码中的setting
      if (config && config.setting) {
        Object.assign(nodeConfig.setting, config.setting);
      }

      const node = graph.createNode(nodeConfig);

      //调用自定义节点的自定义renderd方法，用于节点创建后进行二次修改
      if (element.rendered && typeof element.rendered === 'function') {
        element.rendered(node, nodeConfig.data);
      }

      //需要重复设置data，否则取不到值
      node.setData((config && config.data) || element.data);
      if (element.event) {
        for (let e in element.event) {
          node.on(e, arg => {
            if (element.event[e]) {
              element.event[e](arg, element);
            }
          });
        }
      }
      //设置节点类型
      node.prop('type', element.type);
      return node;
    }
    return null;
  }
};

export { NodeFactory };
