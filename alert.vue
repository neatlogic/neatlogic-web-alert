<template>
  <div v-if="hasAuthorization" class="home" :class="{ 'menu-min': !isMenuExpanded }">
    <TopNav></TopNav>
    <LeftMenu @menuToggle="menuToggle">
      <AlertMenu></AlertMenu>
    </LeftMenu>
    <div class="centermain">
      <div>
        <router-view v-if="isRouterAlive" :key="$route.fullPath" style="height:100%;overflow: auto;"></router-view>
      </div>
    </div>
    <LicenseValidator></LicenseValidator>
  </div>
</template>
<script>
export default {
  name: 'Home',
  provide() {
    return {
      reloadRouter: this.reloadRouter
    };
  },
  components: {
    TopNav: () => import('@/views/components/topnav/topnav.vue'),
    LeftMenu: () => import('@/views/components/leftmenu/leftmenu.vue'),
    LicenseValidator: () => import('@/views/components/license/license-validator.vue'),
    AlertMenu: () => import('@/community-module/alert/pages/leftmenu/alert-menu.vue')
  },
  data() {
    return {
      isMenuExpanded: false, //菜单收起时的class
      hasAuthorization: true,
      isRouterAlive: true
    };
  },
  created() {},
  beforeDestroy() {},
  methods: {
    //菜单显示隐藏
    menuToggle(isMenuExpanded) {
      this.isMenuExpanded = isMenuExpanded;
    },
    reloadRouter() { //切换多语言时，刷新路由
      this.isRouterAlive = false;
      this.$store.dispatch('getModuleList');
      this.$nextTick(() => {
        this.isRouterAlive = true;
        location.reload();
      });
    }
  },
  watch: {}
};
</script>
