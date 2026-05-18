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
const alertMarkManage = () => import('@/community-module/alert/pages/alertmark/alertmark-manage.vue');
const alertActionManage = () => import('@/community-module/alert/pages/alertaction/action-manage.vue');
const breakerPolicyManage = () => import('@/community-module/alert/pages/breaker/breaker-policy-manage.vue');
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
      title: $t('page.alertlist'),
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
      title: $t('term.alert.alertdetail'),
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
      title: $t('term.alert.incomerecord'),
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
      title: $t('term.alert.deletedalert'),
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
      title: $t('term.alert.alertcasemanage'),
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
      title: $t('term.alert.alerttypemanage'),
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
      title: $t('term.alert.extendattrmanage'),
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
      title: $t('term.alert.alertlevelmanage'),
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
      title: $t('term.alert.alertstatusmanage'),
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
      title: $t('term.alert.alertrulemanage'),
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
      title: $t('term.alert.alertsourcemanage'),
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
      title: $t('term.alert.notifytemplatemanage'),
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
      title: $t('term.alert.alertpluginmanage'),
      ismenu: true,
      icon: 'tsfont-plugin',
      type: 'alertmanage',
      authority: 'ALERT_EVENT_PLUGIN_MODIFY'
    }
  },
  {
    path: '/breaker-policy-manage',
    name: 'breaker-policy-manage',
    component: breakerPolicyManage,
    meta: {
      title: $t('term.alert.breakerpolicymanage'),
      ismenu: true,
      icon: 'tsfont-unbind',
      type: 'breakermanage',
      authority: 'ALERT_BREAKER_MODIFY'
    }
  },
  {
    path: '/catalog-manage',
    name: 'catalog-manage',
    component: catalogManage,
    meta: {
      title: $t('term.alert.viewcatalogmanage'),
      ismenu: false,
      authority: 'ALERT_VIEW_MODIFY'
    }
  },
  {
    path: '/alertmark-manage',
    name: 'alertmark-manage',
    component: alertMarkManage,
    meta: {
      title: $t('term.alert.alerttagmanage'),
      ismenu: true,
      icon: 'tsfont-tags',
      type: 'alertmanage',
      authority: 'ALERT_MARK_MODIFY'
    }
  },
  {
    path: '/alertaction-manage',
    name: 'alertaction-manage',
    component: alertActionManage,
    meta: {
      title: $t('term.alert.customactionmanage'),
      ismenu: true,
      icon: 'tsfont-lightning',
      type: 'alertmanage',
      authority: 'ALERT_ACTION_MODIFY'
    }
  }

];

import ComponentManager from '@/resources/import/component-manager.js';
let importRouterList = ComponentManager.getRouterComponent(config.module) || [];
export default [...routerArr, ...importRouterList];
