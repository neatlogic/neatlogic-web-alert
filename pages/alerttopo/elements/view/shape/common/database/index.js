import { NumberExt } from '@antv/x6';
import base from '../../base.js';
export default {
  ...base,
  name: 'common_database',
  label: '数据库',
  type: 'common',
  icon: 'tsfont-component',
  config: {
    markup: [
      {
        tagName: 'path',
        selector: 'body'
      },
      {
        tagName: 'ellipse',
        selector: 'top'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      body: {
        fill: 'none',
        stroke: '#333333',
        strokeWidth: 2,
        lateral: 10
      },
      top: {
        fill: 'none',
        stroke: '#333333',
        strokeWidth: 2,
        refCx: '50%',
        refRx: '50%',
        cy: 10,
        ry: 10
      },
      label: {
        refX: 10,
        refY: '40%',
        'text-anchor': 'start'
      }
    },
    attrHooks: {
      lateral: {
        set(t, { refBBox }) {
          const isPercentage = NumberExt.isPercentage(t);
          if (isPercentage) {
            // eslint-disable-next-line
            t = parseFloat(t) / 100;
          }

          const x = refBBox.x;
          const y = refBBox.y;
          const w = refBBox.width;
          const h = refBBox.height;

          // curve control point variables
          const rx = w / 2;
          const ry = isPercentage ? h * t : t;

          const kappa = 0.551784;
          const cx = kappa * rx;
          const cy = kappa * ry;

          // shape variables
          const xLeft = x;
          const xCenter = x + w / 2;
          const xRight = x + w;

          const ySideTop = y + ry;
          const yCurveTop = ySideTop - ry;
          const ySideBottom = y + h - ry;
          const yCurveBottom = y + h;

          // return calculated shape
          const data = ['M', xLeft, ySideTop, 'L', xLeft, ySideBottom, 'C', x, ySideBottom + cy, xCenter - cx, yCurveBottom, xCenter, yCurveBottom, 'C', xCenter + cx, yCurveBottom, xRight, ySideBottom + cy, xRight, ySideBottom, 'L', xRight, ySideTop, 'C', xRight, ySideTop - cy, xCenter + cx, yCurveTop, xCenter, yCurveTop, 'C', xCenter - cx, yCurveTop, xLeft, ySideTop - cy, xLeft, ySideTop, 'Z'];

          return { d: data.join(' ') };
        }
      }
    }
  },
  rendered: (node, data) => {
    const attrs = {
      body: {
        fill: data.bgColor,
        stroke: data.borderColor,
        strokeWidth: data.borderWidth
      },
      top: {
        fill: data.bgColor,
        stroke: data.borderColor,
        strokeWidth: data.borderWidth
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
    radius: 0
  },
  prop: {
    width: 150,
    height: 40
  },
  event: {},
  setting: {
    resizable: false,
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
