import base from '../../base.js';
export default {
  ...base,
  name: 'common_rect',
  label: '矩形',
  type: 'common',
  allowBindAlert: true, //是否支持绑定告警数量
  allowAutoFill: true, //支持自动填充到其他组件
  icon: 'tsfont-component',
  config: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      body: {
        class: 'common-rect',
        refWidth: 1,
        refHeight: 1,
        stroke: '#237804',
        fill: '#73d13d',
        rx: 10,
        ry: 10
      },
      label: {
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      }
    }
  },
  rendered: (node, data) => {
    const attrs = {
      body: {
        fill: data.bgColor,
        class: !data.bgColor ? 'common-rect' : '',
        stroke: data.borderColor,
        strokeWidth: data.borderStyle === 'none' ? 0 : data.borderWidth,
        strokeDasharray: data.borderStyle === 'dashed' ? '2,2' : null,
        ry: data.radius,
        rx: data.radius
      },
      label: {
        text: data.text,
        fontSize: data.fontSize,
        style: {
          fill: data.fontColor
        }
      }
    };
    node.setAttrs(attrs);
    base.rendered(node, data);
  },
  data: {
    text: '',
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
    alertbind: {} //支持绑定告警
  },
  form: [
    {
      name: 'text',
      label: '文本',
      type: 'text'
    },
    {
      name: 'borderStyle',
      label: '边框风格',
      type: 'radio',
      dataList: [
        { value: 'none', text: '无边框' },
        { value: 'solid', text: '实线' },
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
    },
    {
      name: 'radius',
      label: '圆角',
      type: 'slot'
    }
  ],
  //是否支持自定义数据
  enableCustomData: true
 
};
