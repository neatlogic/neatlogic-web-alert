import circle from './circle.vue';
import base from '../../base.js';

export default {
  name: 'common_circle',
  label: '圆形',
  type: 'common',
  icon: 'tsfont-component',
  allowAutoFill: true, //是否支持自动填充到其他组件
  allowBindAlert: true, //是否支持绑定告警数量
  isVue: true, //需要声明是vue组件
  config: {
    shape: 'common_circle',
    component: circle
  },
  data: {
    ciEntityId: null,
    ciEntityName: '',
    bgColor: null,
    borderColor: null,
    fontColor: null,
    borderStyle: 'none',
    borderWidth: 1
  },
  prop: {
    width: 150,
    height: 150
  },
  event: {},
  setting: {
    resizable: true,
    deleteable: true,
    draggable: true,
    selectable: true,
    linkin: true,
    linkout: true,
    alertbind: {} //支持绑定告警
  },
  mapping: [
    {
      name: 'ciEntityId',
      label: '配置项id',
      type: ['_id']
    },
    {
      name: 'ciEntityName',
      label: '文案',
      type: ['_name', 'text', 'textarea']
    }
  ],
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
      name: 'fontColor',
      label: '文本颜色',
      type: 'slot'
    },
    {
      name: 'bgColor',
      label: '背景颜色',
      type: 'slot'
    }
  ],
  enableCustomData: true,
  ...base
};
