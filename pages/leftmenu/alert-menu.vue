<template>
  <div class="menu_link alert-menu-box">
    <div :class="{ grid: pageCount > 1 }">
      <ul>
        <li v-if="$AuthUtils.hasRole(['ALERT_VIEW_MODIFY'])" class="link">
          <a class="tsfont-plus text-primary" @click="addView">
            <span class="text-primary">{{ $t('term.cmdb.view') }}</span>
          </a>
        </li>
        <li class="link alert-menu-link" :class="{ active: $isMenuActive('/alert-manage') }" @click="goTo('/alert-manage')">
          <a class="alert-menu-a tsfont-solid-circle" @click="goTo('/alert-manage')">
            <span class="alert-name overflow">所有告警</span>
            <span v-if="alertCount > 0" class="text-error ml-xs superscript">
              <b>{{ alertCount > 99 ? '99+' : alertCount }}</b>
            </span>
          </a>
        </li>
        <li
          v-for="(view, index) in alertViewList"
          :key="index"
          class="link alert-menu-link"
          :class="{ active: $isMenuActive('/alert-manage/' + view.name) }"
        >
          <a class="alert-menu-a tsfont-circle" @click="goTo('/alert-manage/' + view.name)">
            <span class="alert-name overflow ">{{ view.label }}</span>
            <span v-if="alertCount > 0" class="text-error ml-xs superscript">
              <b>{{ view.alertCount > 99 ? '99+' : view.alertCount }}</b>
            </span>
          </a>
        </li>
      </ul>
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
  </div>
</template>
<script>
import LeftMenu from '@/views/components/leftmenu/leftmenu';
export default {
  name: 'AlertMenu',
  components: {
    VerticalPager: () => import('@/resources/plugins/VerticalPager/vertical-pager.vue'),
    AlertViewEdit: () => import('@/commercial-module/alert/pages/alert/alert-view-edit.vue')
  },
  extends: LeftMenu,
  data: function() {
    return {
      alertViewList: [],
      searchParam: {},
      pageCount: 0,
      isViewEdit: false,
      alertCount: 0
    };
  },
  created() {
    this.searchAlertView();
    this.$api.alert.alert.searchAlertCount().then(res => {
      this.alertCount = res.Return;
    });
  },
  mounted() {},
  methods: {
    addView() {
      this.isViewEdit = true;
    },
    searchAlertView() {
      this.$api.alert.alert.searchAlertView(this.searchParam).then(res => {
        this.alertViewList = res.Return.tbodyList;
        this.pageCount = res.Return.pageCount;
        if (this.alertViewList && this.alertViewList.length > 0) {
          this.alertViewList.forEach(view => {
            this.$api.alert.alert.searchAlertCount({ viewName: view.name }).then(res => {
              view.alertCount = res.Return;
            });
          });
        }
      });
    },
    closeViewEdit(needRefresh) {
      this.isViewEdit = false;
      if (needRefresh) {
        this.searchAlertView();
      }
    },
    handlePageSize(currentPage) {
      this.searchParam.currentPage = currentPage;
      this.searchParam.pageSize = 10;
      this.searchAlertView();
    }
  },
  computed: {},
  watch: {
    '$store.state.leftMenu.alertViewCount'(val, oldVal) {
      this.searchAlertView();
      if (val < oldVal) {
        //删除了视图，需要切换当前视图
        this.goTo('/alert-manage');
      }
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
