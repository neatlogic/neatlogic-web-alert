import { $t } from '@/resources/init.js';
const refresh = () => import('@/views/pages/common/refresh.vue');
const noAuthority = () => import('@/views/pages/common/no-authority.vue');
const welcome = () => import('@/views/pages/common/welcome.vue');
const alertTypeManage = () => import('@/commercial-module/alert/pages/alerttype/alerttype-manage.vue');
const alertManage = () => import('@/commercial-module/alert/pages/alert/alert-manage.vue');
const attrTypeManage = () => import('@/commercial-module/alert/pages/attrtype/attrtype-manage.vue');
const alertLevelManage = () => import('@/commercial-module/alert/pages/alertlevel/alertlevel-manage.vue');
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
    path: '/alerttype-manage',
    name: 'alerttype-manage',
    component: alertTypeManage,
    meta: {
      title: '告警类型管理',
      ismenu: true,
      type: 'alertmanage',
      authority: 'ALERT_TYPE_MODIFY'
    }
  },
  {
    path: '/alert-manage/:view?',
    name: 'alert-manage',
    component: alertManage,
    meta: {
      title: '告警列表',
      ismenu: true,
      type: 'alert',
      authority: 'ALERT_BASE'
    }
  },
  {
    path: '/attrtype-manage',
    name: 'attrtype-manage',
    component: attrTypeManage,
    meta: {
      title: '扩展属性管理',
      ismenu: true,
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
      type: 'alertmanage',
      authority: 'ALERT_LEVEL_MODIFY'
    }
  }
];

export default routerArr;
