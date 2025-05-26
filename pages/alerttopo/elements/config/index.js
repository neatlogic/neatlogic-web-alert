import ComponentManager from '@/resources/import/component-manager.js';

import cmdb_rect from './shape/cmdb/cmdb_rect-config.vue';
import cmdb_circle from './shape/cmdb/cmdb_circle-config.vue';
import cmdb_icon from './shape/cmdb/cmdb_icon-config.vue';
import cmdbrel_zone from './shape/cmdbrel/cmdbrel_zone-config.vue';
import layout_lane from './shape/layout/layout_lane-config.vue';
import layout_zone from './shape/layout/layout_zone-config.vue';
import common_database from './shape/common/common_database-config.vue';
import common_rect from './shape/common/common_rect-config.vue';
import common_cube from './shape/common/common_cube-config.vue';
import common_vline from './shape/common/common_vline-config.vue';
import common_hline from './shape/common/common_hline-config.vue';
import common_text from './shape/common/common_text-config.vue';

// 获取动态组件
const dynamicComponents = ComponentManager.getDiagramWidgetConfigComponent() || {};

const allComponents = {
  cmdb_rect,
  cmdb_circle,
  cmdb_icon,
  cmdbrel_zone,
  layout_lane,
  layout_zone,
  common_database,
  common_rect,
  common_cube,
  common_vline,
  common_hline,
  common_text,
  ...dynamicComponents // 把动态组件合并进来
};

export default allComponents;
