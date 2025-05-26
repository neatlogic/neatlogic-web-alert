import rect from './zone.vue';
import base from '../../base.js';
export default {
  name: 'layout_zone',
  label: '区域',
  type: 'layout',
  icon: 'tsfont-component',
  isVue: true, //需要声明是vue组件
  config: {
    shape: 'layout_zone',
    component: rect
  },
  data: {
    bgColor: null,
    borderColor: null,
    fontColor: null,
    borderStyle: 'none',
    borderWidth: 1,
    radius: 0
  },
  prop: {
    width: 150,
    height: 40
  },
  event: {},
  setting: {
    resizable: true,
    deleteable: true,
    draggable: true,
    selectable: true,
    linkin: true,
    linkout: true,
    autofill: {}, //支持自动填充需要提供个空对象用于存放数据
    children: ['*']
  },
  /*restrict(node) {
    return node.getBBox().moveAndExpand({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
  },*/
  form: [
    {
      name: 'borderStyle',
      label: '边框风格',
      type: 'radio',
      dataList: [
        { value: 'none', text: '无边框' },
        { value: 'solid', text: '实线' },
        { value: 'double', text: '双线' },
        { value: 'dotted', text: '点线' },
        { value: 'dashed', text: '虚线' }
      ]
    },
    {
      name: 'borderWidth',
      label: '边框宽度',
      type: 'slot'
    },
    {
      name: 'borderColor',
      label: '边框颜色',
      type: 'slot'
    },
    {
      name: 'bgColor',
      label: '背景颜色',
      type: 'slot'
    },
    {
      name: 'radius',
      label: '圆角',
      type: 'slot'
    }
  ],
  //是否支持自定义数据
  enableCustomData: true,
  ...base
};
