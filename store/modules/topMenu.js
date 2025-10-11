import alertApi from '@/community-module/alert/api/alert/alert.js';
async function updateAlertMenu({ commit, state, rootState, forceUpdate = true, hasCustomMenuAuthority } = {}) {
  await state.gettingModuleList;
  const alertModule = state.moduleList.find(item => item.moduleId === 'alert');
  if (!alertModule || (!forceUpdate && state.dynamicMenu.hasOwnProperty('alert')) || !hasCustomMenuAuthority('alert', 'alert-manage')) {
    return;
  }
  const res = await alertApi.updateAlertMenu();
  if (!res.Return || res.Return.length === 0) return;
  const alertViewList = res.Return.map(view => ({
    name: view.label,
    path: `/alert-manage/${view.name}`,
    url: `/alert-manage/${view.name}`,
    icon: 'tsfont-dot'
  }));
  const newMenuGroup = [
    {
      menuTypeName: '告警视图',
      menuList: alertViewList
    }
  ];
  commit('updateMenu', { module: alertModule, startIndex: 0, newMenuGroup });
  return res;
}
export default updateAlertMenu;
