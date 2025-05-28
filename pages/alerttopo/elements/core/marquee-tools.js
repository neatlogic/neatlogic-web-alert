import { ToolsView } from '@antv/x6';
import { Dom } from '@antv/x6-common';

// 自定义 MarqueeTool
export class marquee extends ToolsView.ToolItem {
  onRender() {
    // 外层SVG
    const xmlns = 'http://www.w3.org/2000/svg';
    const foreign = document.createElementNS(xmlns, 'foreignObject');
    // 获取父节点宽度
    const view = this.cellView;
    const bbox = view.cell.getBBox();
    const marqueeWidth = Math.max(bbox.width, 120);
    const width = this.options.width || marqueeWidth;
    const height = this.options.height || 30;
    const direction = this.options.direction || 'left';
    const scrollamount = this.options.scrollamount || 6;
    const text = this.options.text || '暂无内容';

    foreign.setAttribute('width', width);
    foreign.setAttribute('height', height);
    foreign.setAttribute('x', 0);
    foreign.setAttribute('y', 0);

    // 创建 HTML 内容
    const div = document.createElement('div');
    div.innerHTML = `<marquee direction="${direction}" behavior="scroll" scrollamount="${scrollamount}" onmouseover="this.stop()" onmouseout="this.start()" direction="left" style="width:${width}px;height:${height}px;font-size:12px;background:transparent;" class="text-default">${text}</marquee>`;

    foreign.appendChild(div);
    this.container.appendChild(foreign);

    Dom.addClass(this.container, this.prefixClassName('cell-tool-htmlmarquee'));
    //绑定事件到marquee-item组件
   
    if (this.options.onClick && typeof this.options.onClick === 'function') {
      div.addEventListener('click', (e) => {
        const target = e.target.closest('.marquee-item');
        if (target) {
          // 这里可拿 data-index、data-id 或 innerText 等
          this.options.onClick(target);
        }
      });
    }
    
    this.update();
  }

  update() {
    this.updatePosition();
    return this;
  }

  updatePosition() {
    const view = this.cellView;
    const bbox = view.cell.getBBox();
    const options = this.options;

    let offsetX = 0;
    let offsetY = 0;
    if (options.offset) {
      offsetX = options.offset.x || 0;
      offsetY = options.offset.y || 0;
    }
    let x = options.x || 0;
    let y = options.y || 0;

    const matrix = Dom.createSVGMatrix().translate(bbox.x + x + offsetX, bbox.y + y + offsetY);
    Dom.transform(this.container, matrix, { absolute: true });
  }
}

marquee.config({
  name: 'marquee',
  useCellGeometry: true,
  events: {}
  // 这里不用 markup，用 onRender 直接挂HTML
});
