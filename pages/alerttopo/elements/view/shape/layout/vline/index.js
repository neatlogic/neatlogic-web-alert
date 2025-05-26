export default {
  name: 'common_vline',
  label: '垂直线',
  type: 'layout',
  icon: 'tsfont-option-vertical',
  config: {
    markup: [
      {
        tagName: 'polyline',
        selector: 'line'
      }
    ],
    attrs: {
      line: {
        refPoints: '0,0 0,100'
      }
    }
  },
  rendered: (node, data) => {
    const attrs = {
      line: {
        fill: 'none',
        stroke: data.borderColor,
        strokeWidth: data.borderWidth
      }
    };
    node.setAttrs(attrs);
  },
  data: {
    borderColor: '#555',
    borderWidth: 2
  },
  prop: {
    width: 2,
    height: 100
  },
  event: {},
  setting: {
    resizable: false,
    deleteable: true,
    draggable: true,
    selectable: true
  },
  form: [
    {
      name: 'borderWidth',
      label: '线宽',
      type: 'slot'
    },
    {
      name: 'borderColor',
      label: '颜色',
      type: 'slot'
    }
  ]
};
