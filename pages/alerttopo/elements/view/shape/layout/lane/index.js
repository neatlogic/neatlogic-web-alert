import lane from './lane.vue';

export default {
  name: 'layout_lane',
  label: '泳道',
  type: 'layout',
  icon: 'tsfont-component',
  isVue: true, //需要声明是vue组件
  config: {
    shape: 'layout_lane',
    component: lane
  },
  data: {
    lanes: []
  },
  prop: {
    width: 400,
    height: 400
  },
  event: {},
  setting: {
    resizable: true,
    deleteable: true,
    draggable: true,
    selectable: true,
    linkin: false,
    linkout: false,
    children: ['*'],
    embedpadding: [40, 10, 10, 10] //父节点根据子节点位置自动扩展收缩时离四条边的边距，按上右下左四个顺序定义
  },
  /*restrict(node) {
    //返回子节点可移动空间
    console.log(node);
    return node.getBBox().moveAndExpand({
      x: 0,
      y: 40,
      width: 0,
      height: -40
    });
  },*/
  form: [
    {
      name: 'lanes',
      label: '泳道设置',
      type: 'slot'
      
    }
  ]
};
