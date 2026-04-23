<template>
  <div class="menu_link alert-menu-box">
    <div :class="{ grid: pageCount > 1 }">
      <div>
        <div v-if="$AuthUtils.hasRole(['ALERT_VIEW_MODIFY'])" class="link alert-menu-link">
          <div class="menu-grid-bak">
            <div>
              <Dropdown
                @on-click="
                  name => {
                    if (name === 'view') {
                      addView();
                    } else if (name === 'catalog') {
                      addCatalog();
                    } else if (name === 'manage') {
                      toEditView();
                    }
                  }
                "
              >
                <a class="alert-menu-a">
                  <span class="text-href tsfont-plus"></span>
                  <span class="text-href ml-xs">{{ $t('page.add') }}</span>
                  <span class="text-href tsfont-drop-down"></span>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="view">
                    <span class="tsfont-plus">{{ $t('term.cmdb.view') }}</span>
                  </DropdownItem>
                  <DropdownItem name="catalog">
                    <span class="tsfont-plus">{{ $t('page.catalogue') }}</span>
                  </DropdownItem>
                  <DropdownItem name="manage" divided>
                    <span class="tsfont-setting">{{ $t('page.manage') }}</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <!--<div style="line-height: 2.85">
              <Poptip :wdith="200" :transfer="true" placement="bottom-start">
                <a><span class="text-href tsfont-search"></span><span class="text-href">搜索</span></a>
                <div slot="content">
                  <InputSearcher v-model="keyword" placeholder="请输入视图关键字"></InputSearcher>
                </div>
              </Poptip>
            </div>-->
          </div>
        </div>
        <div class="link alert-menu-link" :class="{ active: $isMenuActive('/alert-manage') }" @click="goTo('/alert-manage')">
          <a class="alert-menu-a tsfont-monitor" @click="goTo('/alert-manage')">
            <span class="alert-name">{{ $t('term.alert.allalert') }}</span>
            <span v-if="alertCount > 0" class="text-error ml-xs superscript">
              <b>{{ alertCount }}</b>
            </span>
          </a>
        </div>
        <AlertCatalogMenuNode
          v-for="catalog in filterAlertCatalogTreeList"
          :key="catalog.id"
          :catalog="catalog"
          :level="0"
          @go-to="goTo"
        ></AlertCatalogMenuNode>
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
    AlertCatalogEdit: () => import('@/community-module/alert/pages/alert/alert-catalog-edit.vue'),
    //InputSearcher: () => import('@/resources/components/InputSearcher/InputSearcher.vue'),
    AlertCatalogMenuNode: () => import('./alert-menu-node.vue')
  },
  extends: LeftMenu,
  data: function() {
    return {
      alertCatalogList: [],
      searchParam: { isActive: 1, needView: 1, pageSize: 20, currentPage: 1 },
      pageCount: 0,
      isViewEdit: false,
      isCatalogEdit: false,
      alertCount: 0,
      keyword: ''
    };
  },
  created() {
    this.searchAlertCatalogView();
    this.$api.alert.alert.searchAlertCount().then(res => {
      this.alertCount = res.Return;
    });
  },
  methods: {
    toEditView() {
      this.$router.push({ path: '/catalog-manage' });
    },
    addView() {
      this.isViewEdit = true;
    },
    addCatalog() {
      this.isCatalogEdit = true;
    },
    buildCatalogTree(list, parentId = null, pathSet = new Set()) {
      return (list || [])
        .filter(item => (item.parentId || null) === parentId)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map(item => {
          if (pathSet.has(item.id)) {
            return {
              ...item,
              _hideview: true,
              children: []
            };
          }
          const nextPathSet = new Set(pathSet);
          nextPathSet.add(item.id);
          const children = this.buildCatalogTree(list, item.id, nextPathSet);
          return {
            ...item,
            _hideview: true,
            children: children
          };
        });
    },
    searchAlertCatalogView() {
      this.$api.alert.catalog.searchAlertCatalog(this.searchParam).then(res => {
        const catalogList = res.Return && res.Return.tbodyList ? res.Return.tbodyList : [];
        this.alertCatalogList = this.buildCatalogTree(catalogList);
        this.pageCount = res.Return.pageCount;
        this.setViewAlertCount(this.alertCatalogList);
      });
    },
    setViewAlertCount(catalogList) {
      (catalogList || []).forEach(catalog => {
        if (catalog.viewList && catalog.viewList.length > 0) {
          catalog.viewList.forEach(view => {
            this.$api.alert.alert.searchAlertCount({ viewName: view.name }).then(res => {
              this.$set(view, 'alertCount', res.Return);
            });
          });
        }
        if (catalog.children && catalog.children.length > 0) {
          this.setViewAlertCount(catalog.children);
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
  computed: {
    filterAlertCatalogTreeList() {
      const keyword = this.keyword ? this.keyword.trim().toLowerCase() : '';
      if (!keyword) {
        return this.alertCatalogList;
      }
      const filterCatalog = list => {
        const result = [];
        (list || []).forEach(catalog => {
          const children = filterCatalog(catalog.children || []);
          const viewList = (catalog.viewList || []).filter(view => {
            const label = view.label ? view.label.toLowerCase() : '';
            const name = view.name ? view.name.toLowerCase() : '';
            return label.includes(keyword) || name.includes(keyword);
          });
          if (children.length > 0 || viewList.length > 0) {
            result.push({
              ...catalog,
              _hideview: false,
              children: children,
              viewList: viewList
            });
          }
        });
        return result;
      };
      return filterCatalog(this.alertCatalogList);
    }
  },
  watch: {
    '$store.state.leftMenu.alertViewCount'() {
      this.searchAlertCatalogView();
    }
  }
};
</script>
<style lang="less" scoped>
.menu-grid {
  display: grid;
  grid-template-columns: 50% 50%;
}
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
      margin-right: 0px !important;
    }
    .alert-menu-setting-icon {
      right: 4px;
    }
    .alert-name {
      max-width: calc(100% - 40px);
    }
  }
  .alert-name {
    display: inline-block;
    white-space: normal;
    word-break: break-all;
    max-width: calc(100% - 30px);
    height: auto;
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
    font-size: 0.7em;
    vertical-align: super;
  }
}
</style>
