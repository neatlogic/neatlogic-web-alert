import { NumberExt } from '@antv/x6';
import base from '../../base.js';
export default {
  ...base,
  name: 'common_cube',
  label: '立方体',
  type: 'common',
  icon: 'tsfont-component',
  config: {
    markup: [
      {
        tagName: 'path',
        selector: 'front'
      },
      {
        tagName: 'path',
        selector: 'top'
      },
      {
        tagName: 'path',
        selector: 'side'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      top: {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 2,
        top: 10
      },
      side: {
        fill: 'red',
        stroke: '#333333',
        strokeWidth: 2,
        side: 10
      },
      front: {
        fill: '#FFFFFF',
        stroke: '#333333',
        strokeWidth: 2,
        'fill-opacity': 0.7,
        front: 10
      },
      label: {
        text: '立体正方体',
        refX: '50%',
        refY: '100%',
        refY2: 10,
        'text-anchor': 'middle',
        'text-vertical-anchor': 'middle'
      }
    },
    attrHooks: {
      top: {
        set(t, {cell, refBBox }) {
          const isPercentage = NumberExt.isPercentage(t);
          if (isPercentage) {
            // eslint-disable-next-line
            t = parseFloat(t) / 100;
          }

          const x = refBBox.x;
          const y = refBBox.y;
          const width = cell.getData().width;
          const height = cell.getData().height;
          const deep = cell.getData().deep;

          const degree = 20;
          const radians = degree * Math.PI / 180;
          const dx = deep * Math.cos(radians);
          const dy = deep * Math.sin(radians);

          const data = [
            'M', x, y,
            'L', x + width, y,
            'L', x + width + dx, y + dy,
            'L', x + dx, y + dy,
            'Z'
          ];
          cell.size(width + dx, height + dy);
          return { d: data.join(' ') };
        }
      },
      side: {
        set(t, {cell, refBBox }) {
          const isPercentage = NumberExt.isPercentage(t);
          if (isPercentage) {
            // eslint-disable-next-line
            t = parseFloat(t) / 100;
          }

          const x = refBBox.x;
          const y = refBBox.y;
          const width = cell.getData().width;
          const height = cell.getData().height;
          const deep = cell.getData().deep;

          const degree = 20;
          const radians = degree * Math.PI / 180;
          const dx = deep * Math.cos(radians);
          const dy = deep * Math.sin(radians);

          const data = [
            'M', x, y,
            'L', x + dx, y + dy,
            'L', x + dx, y + dy + height,
            'L', x, y + height,
            'Z'
          ];
          cell.size(width + dx, height + dy);
          return { d: data.join(' ') };
        }
      },
      front: {
        set(t, {cell, refBBox }) {
          const isPercentage = NumberExt.isPercentage(t);
          if (isPercentage) {
            // eslint-disable-next-line
            t = parseFloat(t) / 100;
          }

          const x = refBBox.x;
          const y = refBBox.y;
          const width = cell.getData().width;
          const height = cell.getData().height;
          const deep = cell.getData().deep;
          
          const degree = 20;
          const radians = degree * Math.PI / 180;
          const dx = deep * Math.cos(radians);
          const dy = deep * Math.sin(radians);
          
          const data = [
            'M', x + dx, y + dy,
            'L', x + dx + width, y + dy,
            'L', x + dx + width, y + dy + height,
            'L', x + dx, y + dy + height,
            'Z'
          ];
          cell.size(width + dx, height + dy);
          return { d: data.join(' ') };
        }
      }
    }
  },
  rendered: (node, data) => {
    const attrs = {
      front: {
        fill: data.bgColor,
        stroke: data.borderColor,
        strokeWidth: data.borderWidth,
        width: data.width,
        height: data.height
      },
      top: {
        fill: data.bgColor,
        stroke: data.borderColor,
        strokeWidth: data.borderWidth,
        width: data.width,
        deep: data.deep
      },
      side: {
        fill: data.bgColor,
        stroke: data.borderColor,
        strokeWidth: data.borderWidth,
        height: data.height,
        deep: data.deep
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
    bgColor: '#ddd',
    fontColor: '#555',
    borderColor: '#555',
    borderWidth: 2,
    width: 150,
    height: 100,
    deep: 30,
    radius: 0
  },
  prop: {
  },
  event: {},
  setting: {
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
      name: 'fontColor',
      label: '文本颜色',
      type: 'slot'
    },
    {
      name: 'height',
      label: '高度',
      type: 'slot'
    },
    {
      name: 'width',
      label: '宽度',
      type: 'slot'
    },
    {
      name: 'deep',
      label: '深度',
      type: 'slot'
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
    }
  ],
  enableCustomData: true
 
};
