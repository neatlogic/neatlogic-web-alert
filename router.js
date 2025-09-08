import { $t } from '@/resources/init.js';
const refresh = () => import('@/views/pages/common/refresh.vue');
const noAuthority = () => import('@/views/pages/common/no-authority.vue');
const welcome = () => import('@/views/pages/common/welcome.vue');
const alertTypeManage = () => import('@/community-module/alert/pages/alerttype/alerttype-manage.vue');
const alertManage = () => import('@/community-module/alert/pages/alert/alert-manage.vue');
const alertDetail = () => import('@/community-module/alert/pages/alert/alert-detail.vue');
const attrTypeManage = () => import('@/community-module/alert/pages/attrtype/attrtype-manage.vue');
const alertLevelManage = () => import('@/community-module/alert/pages/alertlevel/alertlevel-manage.vue');
const alertEventManage = () => import('@/community-module/alert/pages/alertevent/alertevent-manage.vue');
const alertOriginManage = () => import('@/community-module/alert/pages/alert/alert-origin-manage.vue');
const notifyTemplateManage = () => import('@/community-module/alert/pages/notifytemplate/notify-template-manage.vue');
const statusManage = () => import('@/community-module/alert/pages/alertstatus/status-manage.vue');
const ruleManage = () => import('@/community-module/alert/pages/alertrule/alertrule-manage.vue');
const eventPluginManage = () => import('@/community-module/alert/pages/alertevent/eventplugin-manage.vue');
const catalogManage = () => import('@/community-module/alert/pages/alertcatalog/catalog-manage.vue');
const sourceManage = () => import('@/community-module/alert/pages/alertsource/alertsource-manage.vue');
const alertTrashManage = () => import('@/community-module/alert/pages/alerttrash/alert-trash-manage.vue');
//const alertTrashDetail = () => import('@/community-module/alert/pages/alerttrash/alert-trash-detail.vue');

import { config } from './config.js';
let routerArr = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      let defaultPage = '';
      try {
        const moduleList = JSON.parse(localStorage.getItem('moduleList'));
        defaultPage =
          moduleList.find(module => {
            return module.moduleId === MODULEID;
          }).defaultPage || '/welcome';
      } catch {
        defaultPage = '/welcome';
      }
      if (from.path === defaultPage) {
        next({ name: 'refresh', replace: true, query: { path: defaultPage } });
      } else {
        next({ path: defaultPage, replace: true });
      }
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/refresh',
    name: 'refresh',
    component: refresh
  },
  {
    path: '/no-authority',
    name: 'no-authority',
    component: noAuthority,
    meta: {
      title: $t('router.common.pagenoexist')
    }
  },
  {
    path: '/alert-manage/:view?',
    name: 'alert-manage',
    component: alertManage,
    meta: {
      title: '告警列表',
      ismenu: false,
      type: 'alert',
      authority: 'ALERT_BASE'
    }
  },
  {
    path: '/alert-detail/:id?',
    name: 'alert-detail',
    component: alertDetail,
    meta: {
      title: '告警详情',
      ismenu: false,
      type: 'alert',
      authority: 'ALERT_BASE'
    }
  },
  {
    path: '/alert-origin-manage',
    name: 'alert-origin-manage',
    component: alertOriginManage,
    meta: {
      title: '接入记录',
      ismenu: true,
      icon: 'tsfont-ipliebiao',
      type: 'alert',
      authority: 'ALERT_BASE'
    }
  },
  {
    path: '/alert-trash-manage',
    name: 'alert-trash-manage',
    component: alertTrashManage,
    meta: {
      title: '已删除告警',
      ismenu: true,
      icon: 'tsfont-trash-o',
      type: 'alert',
      authority: 'ALERT_BASE'
    }
  },
  /*{
    path: '/alert-trash-detail/:id?',
    name: 'alert-trash-detail',
    component: alertTrashDetail,
    meta: {
      title: '告警详情',
      ismenu: false,
      type: 'alert',
      authority: 'ALERT_BASE'
    }
  },*/
  {
    path: '/alertevent-manage/:typeId?',
    name: 'alertevent-manage',
    component: alertEventManage,
    meta: {
      title: '告警事件管理',
      ismenu: false,
      type: 'alertmanage',
      authority: 'ALERT_TYPE_MODIFY'
    }
  },
  {
    path: '/alerttype-manage',
    name: 'alerttype-manage',
    component: alertTypeManage,
    meta: {
      title: '告警类型管理',
      ismenu: true,
      icon: 'tsfont-k8s_service',
      type: 'alertmanage',
      authority: 'ALERT_TYPE_MODIFY'
    }
  },
  {
    path: '/attrtype-manage',
    name: 'attrtype-manage',
    component: attrTypeManage,
    meta: {
      title: '扩展属性管理',
      ismenu: true,
      icon: 'tsfont-formstaticlist',
      type: 'alertmanage',
      authority: 'ALERT_ATTR_MODIFY'
    }
  },
  {
    path: '/alertlevel-manage',
    name: 'alertlevel-manage',
    component: alertLevelManage,
    meta: {
      title: '告警级别管理',
      ismenu: true,
      icon: 'tsfont-chart-polyline',
      type: 'alertmanage',
      authority: 'ALERT_LEVEL_MODIFY'
    }
  },
  {
    path: '/status-manage',
    name: 'status-manage',
    component: statusManage,
    meta: {
      title: '告警状态管理',
      ismenu: true,
      icon: 'tsfont-heart-o',
      type: 'alertmanage',
      authority: 'ALERT_STATUS_MODIFY'
    }
  },
  {
    path: '/alertrule-manage',
    name: 'alertrule-manage',
    component: ruleManage,
    meta: {
      title: '告警特征管理',
      ismenu: true,
      icon: 'tsfont-celve',
      type: 'alertmanage',
      authority: 'ALERT_RULE_MODIFY'
    }
  },
  {
    path: '/alertsource-manage',
    name: 'alertsource-manage',
    component: sourceManage,
    meta: {
      title: '告警来源管理',
      ismenu: true,
      icon: 'tsfont-dataconversion',
      type: 'alertmanage',
      authority: 'ALERT_SOURCE_MODIFY'
    }
  },
  {
    path: '/notify-template-manage',
    name: 'notify-template-manage',
    component: notifyTemplateManage,
    meta: {
      title: '通知模板管理',
      ismenu: true,
      icon: 'tsfont-formtextarea',
      type: 'alertmanage',
      authority: 'ALERT_NOTIFY_TEMPLATE_MODIFY'
    }
  },
  {
    path: '/eventplugin-manage',
    name: 'eventplugin-manage',
    component: eventPluginManage,
    meta: {
      title: '事件插件管理',
      ismenu: true,
      icon: 'tsfont-plugin',
      type: 'alertmanage',
      authority: 'ALERT_EVENT_PLUGIN_MODIFY'
    }
  },
  {
    path: '/catalog-manage',
    name: 'catalog-manage',
    component: catalogManage,
    meta: {
      title: '视图目录管理',
      ismenu: false,
      authority: 'ALERT_VIEW_MODIFY'
    }
  }
];

import ComponentManager from '@/resources/import/component-manager.js';
let importRouterList = ComponentManager.getRouterComponent(config.module) || [];
export default [...routerArr, ...importRouterList];
