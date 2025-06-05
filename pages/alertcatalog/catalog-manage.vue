<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="addCatalog()">目录</div>
          <div class="action-item tsfont-plus" @click="addView()">视图</div>
        </div>
      </template>
      <template v-slot:content>
        <div class="catalog-grid text-grey padding">
          <div></div>
          <div>激活</div>
          <div>授权</div>
          <div>操作</div>
        </div>
        <draggable
          v-bind="dragOptions"
          tag="div"
          :list="catalogList"
          group="catalog"
          handle=".tsfont-bar"
          @end="moveCatalogEnd()"
        >
          <div v-for="catalog in catalogList" :key="catalog.id">
            <div class="bg-op radius-md padding mb-md catalog-grid">
              <div>
                <span class="tsfont-bar move"></span>
                <span class="ml-md cursor" :class="{ 'tsfont-drop-right': catalog.viewList && catalog.viewList.length > 0 && catalog._hideview, 'tsfont-drop-down': catalog.viewList && catalog.viewList.length > 0 && !catalog._hideview }" @click="toggleCatalog(catalog)"></span>
                <span>{{ catalog.name }}</span>
              </div>
              <div>
                <span v-if="catalog.isActive" class="text-success">是</span>
                <span v-else class="text-grey">否</span>
              </div>
              <div>
                <UserSelect
                  v-model="catalog.authList"
                  :multiple="true"
                  :readonly="true"
                  :groupList="['common', 'user', 'role', 'team']"
                ></UserSelect>
              </div>
              <div class="action-group">
                <div class="action-item tsfont-edit" @click="editCatalog(catalog)">{{ $t('page.edit') }}</div>
                <div :class="{ disable: catalog.viewList && catalog.viewList.length > 0 }" class="action-item tsfont-trash-o" @click="deleteCatalog(catalog)">{{ $t('page.delete') }}</div>
              </div>
            </div>
            <div v-if="catalog.viewList && catalog.viewList.length > 0 && !catalog._hideview">
              <draggable
                v-bind="dragOptions"
                tag="div"
                :list="catalog.viewList"
                :group="'catalog_' + catalog.id"
                handle=".tsfont-bar"
                @end="moveViewEnd(catalog)"
              >
                <div v-for="view in catalog.viewList" :key="view.id" class="bg-op radius-md padding mb-md ml-lg catalog-grid">
                  <div>
                    <span class="tsfont-bar move mr-md"></span>
                    <span>{{ view.name }}</span>
                    <span>·</span>
                    <span>{{ view.label }}</span>
                  </div>
                  <div>
                    <span v-if="view.isActive" class="text-success">是</span>
                    <span v-else class="text-grey">否</span>
                  </div>
                  <div><UserSelect
                    v-model="view.authList"
                    :multiple="true"
                    :readonly="true"
                    :groupList="['common', 'user', 'role', 'team']"
                  ></UserSelect></div>
                  <div class="action-group">
                    <div class="action-item tsfont-edit" @click="editView(view)">{{ $t('page.edit') }}</div>
                    <div class="action-item tsfont-trash-o" @click="deleteView(view)">{{ $t('page.delete') }}</div>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </draggable>
      </template>
    </TsContain>
    <AlertViewEdit v-if="isViewEdit" :id="currentViewId" @close="closeViewEdit"></AlertViewEdit>
    <AlertCatalogEdit v-if="isCatalogEdit" :id="currentCatalogId" @close="closeCatalogEdit"></AlertCatalogEdit>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  name: '',
  components: {
    draggable,
    AlertViewEdit: () => import('@/community-module/alert/pages/alert/alert-view-edit.vue'),
    AlertCatalogEdit: () => import('@/community-module/alert/pages/alert/alert-catalog-edit.vue'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  props: {},
  data() {
    return {
      catalogList: [],
      isViewEdit: false,
      isCatalogEdit: false,
      currentCatalogId: null,
      currentViewId: null,
      dragOptions: {
        animation: 150,
        scroll: true,
        ghostClass: 'ghost'
      }
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertCatalog();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    editView(view) {
      this.isViewEdit = true;
      this.currentViewId = view.id;
    },
    deleteView(view) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('term.cmdb.view') }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.alert.deleteAlertView(view.id).then(res => {
            this.$Message.success(this.$t('message.deletesuccess'));
            vnode.isShow = false;
            this.listAlertCatalog();
            this.$store.commit('leftMenu/setAlertViewCount', 'del');
          });
        }
      });
    },
    deleteCatalog(catalog) {
      if (!catalog.viewList || catalog.viewList.length === 0) {
        this.$createDialog({
          title: this.$t('dialog.title.deleteconfirm'),
          content: this.$t('dialog.content.deleteconfirm', { target: this.$t('page.catalogue') }),
          btnType: 'error',
          'on-ok': vnode => {
            this.$api.alert.catalog.deleteCatalogById(catalog.id).then(res => {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.listAlertCatalog();
              this.$store.commit('leftMenu/setAlertViewCount', 'del');
            });
          }
        });
      }
    },
    addView() {
      this.isViewEdit = true;
    },
    addCatalog() {
      this.isCatalogEdit = true;
      this.currentCatalogId = null;
    },
    editCatalog(catalog) {
      this.isCatalogEdit = true;
      this.currentCatalogId = catalog.id;
    },
    closeViewEdit(needRefresh) {
      this.isViewEdit = false;
      this.currentViewId = null;
      if (needRefresh) {
        this.listAlertCatalog();
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
      }
    },
    closeCatalogEdit(needRefresh) {
      this.isCatalogEdit = false;
      this.currentCatalogId = null;
      if (needRefresh) {
        this.listAlertCatalog();
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
      }
    },
    moveCatalogEnd() {
      this.$api.alert.catalog.updateAlertCatalogSort({ idList: this.catalogList.map(item => item.id) }).then(res => {
        this.$Message.success('排序更新成功');
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
      });
    },
    moveViewEnd(catalog) {
      this.$api.alert.catalog.updateAlertViewSort({ idList: catalog.viewList.map(item => item.id) }).then(res => {
        this.$Message.success('排序更新成功');
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
      });
    },
    toggleCatalog(catalog) {
      this.$set(catalog, '_hideview', !catalog._hideview);
    },
    listAlertCatalog() {
      this.$api.alert.catalog.listAlertCatalog().then(res => {
        this.catalogList = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.move {
  cursor: move;
}
.btn {
  position: absolute;
  right: 20px;
  top: 16px;
}
.catalog-grid {
  display: grid;
  grid-template-columns: auto 100px 400px 150px;
  gap: 10px;
}
</style>
