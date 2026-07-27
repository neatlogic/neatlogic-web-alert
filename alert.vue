<template>
  <ModuleBaseLayout>
    <template #leftMenu>
      <AlertMenu></AlertMenu>
    </template>
  </ModuleBaseLayout>
</template>
<script>
export default {
  name: 'Home',
  components: {
    ModuleBaseLayout: () => import('@/views/components/layout/module-base-layout.vue'),
    AlertMenu: () => import('@/community-module/alert/pages/leftmenu/alert-menu.vue')
  }
};
</script>
