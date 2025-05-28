import { Graph } from '@antv/x6';
import { marquee } from '@/commercial-module/alert/pages/alerttopo/elements/core/marquee-tools.js';

import layout_lane from './layout/lane';
import layout_zone from './layout/zone';
import layout_vline from './layout/vline';
import layout_hline from './layout/hline';

import common_text from './common/text';
import common_database from './common/database';
import common_rect from './common/rect';
import common_circle from './common/circle';
import common_cube from './common/cube';

//自定义数据标记
Graph.registerNodeTool('alertdata', {
  inherit: 'button' // 基类名称，使用已经注册的工具名称。
});

Graph.registerNodeTool('marquee', marquee, true);

export default [layout_lane, layout_zone, layout_vline, layout_hline, common_text, common_circle, common_database, common_rect, common_cube];
