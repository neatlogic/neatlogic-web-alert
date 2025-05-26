import { Button } from '@antv/x6/es/registry/tool/button';
import { $t } from '@/resources/init.js';

const AutofillTool = Button.define({
  markup: [
    {
      tagName: 'rect',
      selector: 'button',
      attrs: {
        class: 'custom-tools',
        width: 40,
        height: 19,
        rx: 5,
        ry: 5,
        cursor: 'pointer'
      }
    },
    {
      tagName: 'text',
      selector: 'text',
      textContent: $t('term.diagram.tryfill'),
      attrs: {
        class: 'custom-tools-text',
        fill: '#fe854f',
        'font-size': 10,
        'text-anchor': 'middle',
        'pointer-events': 'none',
        x: 20,
        y: 13
      }
    }
  ]
});

const ClearAutofillTool = Button.define({
  markup: [
    {
      tagName: 'rect',
      selector: 'button',
      attrs: {
        class: 'custom-tools',
        width: 40,
        height: 19,
        rx: 5,
        ry: 5,
        cursor: 'pointer'
      }
    },
    {
      tagName: 'text',
      selector: 'text',
      textContent: $t('page.clear'),
      attrs: {
        class: 'custom-tools-text',
        fill: '#fe854f',
        'font-size': 10,
        'text-anchor': 'middle',
        'pointer-events': 'none',
        x: 20,
        y: 13
      }
    }
  ],
  onClick({ cell, view }) {
    console.log(cell);
  }
});

export { AutofillTool, ClearAutofillTool };
