<template>
  <div class="menu_link alert-menu-box">
    <div :class="{ grid: pageCount > 1 }">
      <div>
        <div v-if="$AuthUtils.hasRole(['ALERT_VIEW_MODIFY'])" class="link alert-menu-link">
          <Dropdown>
            <a class="alert-menu-a">
              <span class="text-href tsfont-plus"></span>
              <span class="text-href ml-xs">添加</span>
              <span class="text-href tsfont-drop-down"></span>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem><span class="tsfont-plus" @click="addView()">视图</span></DropdownItem>
              <DropdownItem><span class="tsfont-plus" @click="addCatalog()">目录</span></DropdownItem>
              <DropdownItem divided><span class="tsfont-setting" @click="toEditView()">管理</span></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="link alert-menu-link" :class="{ active: $isMenuActive('/alert-manage') }" @click="goTo('/alert-manage')">
          <a class="alert-menu-a tsfont-monitor" @click="goTo('/alert-manage')">
            <span class="alert-name overflow">所有告警</span>
            <span v-if="alertCount > 0" class="text-error ml-xs superscript">
              <b>{{ alertCount > 99 ? '99+' : alertCount }}</b>
            </span>
          </a>
        </div>
        <div v-for="catalog in alertCatalogList" :key="catalog.id">
          <div class="link alert-menu-link">
            <a
              class="alert-menu-a"
              :class="{
                'tsfont-dot': !catalog.viewList || catalog.viewList.length === 0,
                'tsfont-drop-down': catalog.viewList && catalog.viewList.length > 0 && !catalog._hideview,
                'tsfont-drop-right': catalog.viewList && catalog.viewList.length > 0 && catalog._hideview
              }"
              @click="toggleCatalog(catalog)"
            >
              <b class="text-grey">{{ catalog.name }}</b>
            </a>
          </div>
          <div v-if="catalog.viewList && catalog.viewList.length > 0 && !catalog._hideview">
            <div
              v-for="view in catalog.viewList"
              :key="view.id"
              class="link alert-menu-link"
              :class="{ active: $isMenuActive('/alert-manage/' + view.name) }"
            >
              <a class="ml-lg alert-menu-a" @click="goTo('/alert-manage/' + view.name)">
                <span class="alert-name overflow">{{ view.label }}</span>
                <span v-if="alertCount > 0" class="text-error ml-xs superscript">
                  <b>{{ view.alertCount > 99 ? '99+' : view.alertCount }}</b>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div v-if="pageCount > 1" style="margin-top: 44px">
        <VerticalPager
          :currentPage="searchParam.currentPage"
          :pageCount="pageCount"
          @change="
            page => {
              handlePageSize(page);
            }
          "
        ></VerticalPager>
      </div>
    </div>
    <AlertViewEdit v-if="isViewEdit" @close="closeViewEdit"></AlertViewEdit>
    <AlertCatalogEdit v-if="isCatalogEdit" @close="closeCatalogEdit"></AlertCatalogEdit>
  </div>
</template>
<script>
import LeftMenu from '@/views/components/leftmenu/leftmenu';
export default {
  name: 'AlertMenu',
  components: {
    VerticalPager: () => import('@/resources/plugins/VerticalPager/vertical-pager.vue'),
    AlertViewEdit: () => import('@/community-module/alert/pages/alert/alert-view-edit.vue'),
    AlertCatalogEdit: () => import('@/community-module/alert/pages/alert/alert-catalog-edit.vue')
  },
  extends: LeftMenu,
  data: function() {
    return {
      alertCatalogList: [],
      searchParam: { isActive: 1, needView: 1, pageSize: 5, currentPage: 1 },
      pageCount: 0,
      isViewEdit: false,
      isCatalogEdit: false,
      alertCount: 0
    };
  },
  created() {
    this.searchAlertCatalogView();
    this.$api.alert.alert.searchAlertCount().then(res => {
      this.alertCount = res.Return;
    });
  },
  mounted() {},
  methods: {
    toEditView() {
      this.$router.push({ path: '/catalog-manage' });
    },
    toggleCatalog(catalog) {
      this.$set(catalog, '_hideview', !catalog._hideview);
    },
    addView() {
      this.isViewEdit = true;
    },
    addCatalog() {
      this.isCatalogEdit = true;
    },
    searchAlertCatalogView() {
      this.$api.alert.catalog.searchAlertCatalog(this.searchParam).then(res => {
        this.alertCatalogList = res.Return.tbodyList;
        this.pageCount = res.Return.pageCount;
        if (this.alertCatalogList && this.alertCatalogList.length > 0) {
          this.alertCatalogList.forEach(catalog => {
            if (catalog.viewList && catalog.viewList.length > 0) {
              catalog.viewList.forEach(view => {
                this.$api.alert.alert.searchAlertCount({ viewName: view.name }).then(res => {
                  this.$set(view, 'alertCount', res.Return);
                });
              });
            }
          });
        }
      });
    },
    closeViewEdit(needRefresh) {
      this.isViewEdit = false;
      if (needRefresh) {
        this.searchAlertCatalogView();
      }
    },
    closeCatalogEdit(needRefresh) {
      this.isCatalogEdit = false;
      if (needRefresh) {
        this.searchAlertCatalogView();
      }
    },
    handlePageSize(currentPage) {
      this.searchParam.currentPage = currentPage;
      this.searchAlertCatalogView();
    }
  },
  computed: {},
  watch: {
    '$store.state.leftMenu.alertViewCount'(val, oldVal) {
      this.searchAlertCatalogView();
    }
  }
};
</script>
<style lang="less" scoped>
.alert-menu-box {
  .grid {
    display: grid;
    grid-template-columns: 177px 23px;
    .alert-menu-link {
      padding: 0 0 0 6px !important;
    }
    .alert-menu-a {
      position: relative;
      width: 100%;
      padding-right: 0px !important;
    }
    .alert-menu-setting-icon {
      right: 4px;
    }
    .alert-name {
      max-width: calc(100% - 44px);
    }
  }
  .alert-name {
    display: inline-block;
    max-width: calc(100% - 35px);
  }
  .alert-menu-setting-icon {
    position: absolute;
    right: 12px;
    top: 0px;
  }
  .link-grid {
    display: grid;
    grid-template-columns: 15px auto;
  }
  .superscript {
    font-size: 0.7em; /* 设置字体大小为原字体的70% */
    vertical-align: super; /* 设置为上标 */
  }
}
</style>
