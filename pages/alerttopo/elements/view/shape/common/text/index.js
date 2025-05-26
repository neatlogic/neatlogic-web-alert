import text from './text.vue';
import utils from '@/resources/assets/js/util.js';

export default {
  name: 'common_text',
  type: 'common',
  label: '文本',
  icon: 'tsfont-font-color',
  isVue: true, //需要声明是vue组件
  config: {
    shape: 'common_text',
    component: text
  },
  data: {
    text: '文本',
    color: '',
    fontSize: 14,
    isBold: false
  },
  prop: {
    width: 100,
    height: 30
  },
  event: {
    'change:data': ({ cell, current: data }, widget) => {
      //const text = data.text;
      //const width = utils.getTextWidth({ text: name, isBold: true });
      //cell.resize(Math.max(100, width), 30);
    }
  },
  setting: {
    resizable: true,
    deleteable: true,
    draggable: true,
    selectable: true,
    linkin: true,
    linkout: true
  },
  form: [
    {
      name: 'text',
      label: '文本',
      type: 'text'
    },
    {
      name: 'fontSize',
      label: '字体大小',
      type: 'slot'
    },
    {
      name: 'isBold',
      label: '加粗',
      type: 'switch'
    },
    {
      name: 'color',
      label: '字体颜色',
      type: 'slot'
    }
  ]
};
