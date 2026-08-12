<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="addCatalog()">{{ $t('page.catalogue') }}</div>
          <div class="action-item tsfont-plus" @click="addView()">{{ $t('page.view') }}</div>
        </div>
      </template>
      <template v-slot:topRight>
        <div style="text-align: right" :style="{ '--children': 3 }" class="controller-group">
          <div>
            <CombineSearcher
              v-model="searchVal"
              class="search"
              v-bind="searchConfig"
              :width="500"
            ></CombineSearcher>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div class="catalog-grid text-grey padding">
          <div></div>
          <div>{{ $t('page.isactive') }}</div>
          <div>{{ $t('page.auth') }}</div>
          <div>{{ $t('page.action') }}</div>
        </div>
        <draggable
          v-if="!hasSearchCondition"
          v-bind="dragOptions"
          tag="div"
          :list="catalogTreeList"
          :group="{ name: 'catalog', pull: true, put: false }"
          :sort="false"
          handle=".tsfont-bar"
          @start="startCatalogDrag(null, $event, catalogTreeList)"
          @end="handleCatalogDragEnd"
        >
          <AlertCatalogNode
            v-for="catalog in catalogTreeList"
            :key="catalog.id"
            :catalog="catalog"
            :pathIds="[]"
            :parentId="null"
            :catalogIndex="getCatalogIndex(null, catalog.id)"
            :catalogCount="catalogTreeList.length"
            :level="0"
            :dragOptions="dragOptions"
            :draggingData="draggingData"
            :activeDropCatalogId="activeDropCatalogId"
            @edit-catalog="editCatalog"
            @delete-catalog="deleteCatalog"
            @add-child="addChildCatalog"
            @edit-view="editView"
            @delete-view="deleteView"
            @sort-catalog="moveCatalogEnd"
            @sort-view="moveViewEnd"
            @catalog-drag-start="startCatalogDrag"
            @catalog-drag-end="handleCatalogDragEnd"
            @view-drag-start="startViewDrag"
            @view-drag-end="handleViewDragEnd"
            @move-catalog-up="moveCatalogUp"
            @move-catalog-down="moveCatalogDown"
            @move-view-up="moveViewUp"
            @move-view-down="moveViewDown"
            @set-drop-target="setDropTarget"
            @drop-to-catalog="dropToCatalog"
          ></AlertCatalogNode>
        </draggable>
        <div v-else>
          <AlertCatalogNode
            v-for="(catalog, index) in filterCatalogTreeList"
            :key="catalog.id"
            :catalog="catalog"
            :pathIds="[]"
            :parentId="null"
            :catalogIndex="index"
            :catalogCount="filterCatalogTreeList.length"
            :level="0"
            :dragOptions="searchDragOptions"
            :draggingData="null"
            :activeDropCatalogId="null"
            @edit-catalog="editCatalog"
            @delete-catalog="deleteCatalog"
            @add-child="addChildCatalog"
            @edit-view="editView"
            @delete-view="deleteView"
            @move-catalog-up="moveCatalogUp"
            @move-catalog-down="moveCatalogDown"
            @move-view-up="moveViewUp"
            @move-view-down="moveViewDown"
          ></AlertCatalogNode>
        </div>
      </template>
    </TsContain>
    <AlertViewEdit v-if="isViewEdit" :id="currentViewId" @close="closeViewEdit"></AlertViewEdit>
    <AlertCatalogEdit
      v-if="isCatalogEdit"
      :id="currentCatalogId"
      :parentId="currentParentCatalogId"
      @close="closeCatalogEdit"
    ></AlertCatalogEdit>
  </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  name: 'CatalogManage',
  components: {
    draggable,
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    AlertCatalogNode: () => import('./alert-catalog-node.vue'),
    AlertViewEdit: () => import('@/community-module/alert/pages/alert/alert-view-edit.vue'),
    AlertCatalogEdit: () => import('@/community-module/alert/pages/alert/alert-catalog-edit.vue')
  },
  data() {
    return {
      catalogTreeList: [],
      isViewEdit: false,
      isCatalogEdit: false,
      currentCatalogId: null,
      currentParentCatalogId: null,
      currentViewId: null,
      searchVal: {},
      searchConfig: {
        labelWidth: 100,
        searchMode: 'clickBtnSearch',
        labelPosition: 'left',
        searchList: [
          {
            type: 'radio',
            name: 'isActive',
            value: null,
            label: this.$t('page.isactive'),
            dataList: [
              { value: 1, text: this.$t('page.yes') },
              { value: 0, text: this.$t('page.no') }
            ],
            transfer: true,
            allowToggle: true
          },
          {
            type: 'userselect',
            name: 'authList',
            label: this.$t('page.auth'),
            groupList: ['common', 'user', 'role', 'team'],
            transfer: true
          }
        ]
      },
      draggingData: null,
      activeDropCatalogId: null,
      dragOptions: {
        animation: 150,
        scroll: true,
        ghostClass: 'ghost'
      }
    };
  },
  created() {
    this.listAlertCatalog();
  },
  methods: {
    buildCatalogTree(list, parentId = null, pathSet = new Set(), hideStateMap = {}) {
      return (list || [])
        .filter(item => (item.parentId || null) === parentId)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map(item => {
          if (pathSet.has(item.id)) {
            return {
              ...item,
              _hideview: hideStateMap[item.id] !== undefined ? hideStateMap[item.id] : true,
              children: []
            };
          }
          const nextPathSet = new Set(pathSet);
          nextPathSet.add(item.id);
          const children = this.buildCatalogTree(list, item.id, nextPathSet, hideStateMap);
          return {
            ...item,
            _hideview: hideStateMap[item.id] !== undefined ? hideStateMap[item.id] : true,
            children: children
          };
        });
    },
    getCatalogHideStateMap(catalogList, hideStateMap = {}) {
      for (const catalog of catalogList || []) {
        hideStateMap[catalog.id] = !!catalog._hideview;
        if (catalog.children && catalog.children.length > 0) {
          this.getCatalogHideStateMap(catalog.children, hideStateMap);
        }
      }
      return hideStateMap;
    },
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
          this.$api.alert.alert.deleteAlertView(view.id).then(() => {
            this.$Message.success(this.$t('message.deletesuccess'));
            vnode.isShow = false;
            this.listAlertCatalog();
            this.$store.commit('leftMenu/setAlertViewCount', 'del');
          });
        }
      });
    },
    deleteCatalog(catalog) {
      if ((!catalog.children || catalog.children.length === 0) && (!catalog.viewList || catalog.viewList.length === 0)) {
        this.$createDialog({
          title: this.$t('dialog.title.deleteconfirm'),
          content: this.$t('dialog.content.deleteconfirm', { target: this.$t('page.catalogue') }),
          btnType: 'error',
          'on-ok': vnode => {
            this.$api.alert.catalog.deleteCatalogById(catalog.id).then(() => {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.removeCatalogById(this.catalogTreeList, catalog.id);
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
      this.currentParentCatalogId = null;
    },
    addChildCatalog(catalog) {
      this.isCatalogEdit = true;
      this.currentCatalogId = null;
      this.currentParentCatalogId = catalog.id;
    },
    editCatalog(catalog) {
      this.isCatalogEdit = true;
      this.currentCatalogId = catalog.id;
      this.currentParentCatalogId = null;
    },
    closeViewEdit(needRefresh) {
      this.isViewEdit = false;
      this.currentViewId = null;
      if (needRefresh) {
        this.listAlertCatalog();
        //this.$store.commit('leftMenu/setAlertViewCount', 'add');
      }
    },
    closeCatalogEdit(needRefresh) {
      this.isCatalogEdit = false;
      this.currentCatalogId = null;
      this.currentParentCatalogId = null;
      if (needRefresh) {
        this.listAlertCatalog();
        //this.$store.commit('leftMenu/setAlertViewCount', 'add');
      }
    },
    startCatalogDrag(parentId, evt, list) {
      const item = list && list[evt.oldIndex];
      if (item) {
        this.draggingData = {
          type: 'catalog',
          itemId: item.id,
          parentId: parentId
        };
      }
    },
    startViewDrag(catalogId, evt, list) {
      const item = list && list[evt.oldIndex];
      if (item) {
        this.draggingData = {
          type: 'view',
          itemId: item.id,
          catalogId: catalogId
        };
      }
    },
    clearDraggingData() {
      this.$nextTick(() => {
        this.draggingData = null;
        this.activeDropCatalogId = null;
      });
    },
    handleCatalogDragEnd() {
      if (this.activeDropCatalogId && this.draggingData && this.draggingData.type === 'catalog') {
        const targetCatalog = this.findCatalogById(this.catalogTreeList, this.activeDropCatalogId);
        if (targetCatalog) {
          this.moveCatalogToTarget(targetCatalog);
          return;
        }
      }
      this.clearDraggingData();
    },
    handleViewDragEnd() {
      if (this.activeDropCatalogId && this.draggingData && this.draggingData.type === 'view') {
        const targetCatalog = this.findCatalogById(this.catalogTreeList, this.activeDropCatalogId);
        if (targetCatalog) {
          this.moveViewToTarget(targetCatalog);
          return;
        }
      }
      this.clearDraggingData();
    },
    setDropTarget(catalogId) {
      this.activeDropCatalogId = catalogId;
    },
    dropToCatalog(targetCatalog) {
      if (!this.draggingData || !targetCatalog) {
        return;
      }
      if (this.draggingData.type === 'catalog') {
        this.moveCatalogToTarget(targetCatalog);
      } else if (this.draggingData.type === 'view') {
        this.moveViewToTarget(targetCatalog);
      }
    },
    moveCatalogToTarget(targetCatalog) {
      const draggingData = this.draggingData;
      if (!draggingData || draggingData.itemId === targetCatalog.id) {
        return;
      }
      if (this.isCatalogDescendant(draggingData.itemId, targetCatalog.id)) {
        return;
      }
      const sourceList = this.getCatalogListByParentId(draggingData.parentId);
      const targetList = this.getCatalogListByParentId(targetCatalog.id);
      const sourceIndex = sourceList.findIndex(item => item.id === draggingData.itemId);
      if (sourceIndex < 0) {
        return;
      }
      const movedCatalog = sourceList.splice(sourceIndex, 1)[0];
      if (!targetList.find(item => item.id === movedCatalog.id)) {
        targetList.push(movedCatalog);
      }
      movedCatalog.parentId = targetCatalog.id;
      const requestList = [
        this.$api.alert.catalog.updateAlertCatalogSort({
          parentId: targetCatalog.id,
          idList: targetList.map(item => item.id)
        })
      ];
      if (draggingData.parentId !== targetCatalog.id) {
        requestList.push(
          this.$api.alert.catalog.updateAlertCatalogSort({
            parentId: draggingData.parentId,
            idList: sourceList.map(item => item.id)
          })
        );
      }
      Promise.all(requestList).then(() => {
        this.$Message.success('目录移动成功');
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
        this.clearDraggingData();
      }).catch(() => {
        this.listAlertCatalog();
        this.clearDraggingData();
      });
    },
    moveViewToTarget(targetCatalog) {
      const draggingData = this.draggingData;
      const sourceCatalog = this.findCatalogById(this.catalogTreeList, draggingData.catalogId);
      const target = this.findCatalogById(this.catalogTreeList, targetCatalog.id);
      if (!sourceCatalog || !target) {
        return;
      }
      const sourceList = sourceCatalog.viewList || [];
      const targetList = target.viewList || [];
      const sourceIndex = sourceList.findIndex(item => item.id === draggingData.itemId);
      if (sourceIndex < 0) {
        return;
      }
      const movedView = sourceList.splice(sourceIndex, 1)[0];
      if (!targetList.find(item => item.id === movedView.id)) {
        targetList.push(movedView);
      }
      this.$set(target, 'viewList', targetList);
      movedView.catalogId = target.id;
      const requestList = [
        this.$api.alert.catalog.updateAlertViewSort({
          catalogId: target.id,
          idList: targetList.map(item => item.id)
        })
      ];
      if (draggingData.catalogId !== target.id) {
        requestList.push(
          this.$api.alert.catalog.updateAlertViewSort({
            catalogId: draggingData.catalogId,
            idList: sourceList.map(item => item.id)
          })
        );
      }
      Promise.all(requestList).then(() => {
        this.$Message.success('视图移动成功');
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
        this.clearDraggingData();
      }).catch(() => {
        this.listAlertCatalog();
        this.clearDraggingData();
      });
    },
    getCatalogListByParentId(parentId) {
      if (parentId === null || parentId === undefined) {
        return this.catalogTreeList;
      }
      const parentCatalog = this.findCatalogById(this.catalogTreeList, parentId);
      if (!parentCatalog.children) {
        this.$set(parentCatalog, 'children', []);
      }
      return parentCatalog.children;
    },
    getCatalogIndex(parentId, catalogId) {
      const catalogList = this.getCatalogListByParentId(parentId);
      return catalogList.findIndex(item => item.id === catalogId);
    },
    moveCatalogUp(parentId, catalogId) {
      this.moveCatalogByStep(parentId, catalogId, -1);
    },
    moveCatalogDown(parentId, catalogId) {
      this.moveCatalogByStep(parentId, catalogId, 1);
    },
    moveCatalogByStep(parentId, catalogId, step) {
      const catalogList = this.getCatalogListByParentId(parentId);
      const index = catalogList.findIndex(item => item.id === catalogId);
      const targetIndex = index + step;
      if (index < 0 || targetIndex < 0 || targetIndex >= catalogList.length) {
        return;
      }
      const idList = catalogList.map(item => item.id);
      const currentId = idList[index];
      idList.splice(index, 1);
      idList.splice(targetIndex, 0, currentId);
      const movedItem = catalogList.splice(index, 1)[0];
      catalogList.splice(targetIndex, 0, movedItem);
      this.$api.alert.catalog.updateAlertCatalogSort({ parentId: parentId, idList: idList }).then(() => {
        this.$Message.success('排序更新成功');
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
      }).catch(() => {
        const rollbackItem = catalogList.splice(targetIndex, 1)[0];
        catalogList.splice(index, 0, rollbackItem);
      });
    },
    moveViewUp(catalogId, viewId) {
      this.moveViewByStep(catalogId, viewId, -1);
    },
    moveViewDown(catalogId, viewId) {
      this.moveViewByStep(catalogId, viewId, 1);
    },
    moveViewByStep(catalogId, viewId, step) {
      const catalog = this.findCatalogById(this.catalogTreeList, catalogId);
      const viewList = catalog && catalog.viewList ? catalog.viewList : [];
      const index = viewList.findIndex(item => item.id === viewId);
      const targetIndex = index + step;
      if (index < 0 || targetIndex < 0 || targetIndex >= viewList.length) {
        return;
      }
      const idList = viewList.map(item => item.id);
      const currentId = idList[index];
      idList.splice(index, 1);
      idList.splice(targetIndex, 0, currentId);
      const movedItem = viewList.splice(index, 1)[0];
      viewList.splice(targetIndex, 0, movedItem);
      this.$api.alert.catalog.updateAlertViewSort({ catalogId: catalogId, idList: idList }).then(() => {
        this.$Message.success('排序更新成功');
        this.$store.commit('leftMenu/setAlertViewCount', 'add');
      }).catch(() => {
        const rollbackItem = viewList.splice(targetIndex, 1)[0];
        viewList.splice(index, 0, rollbackItem);
      });
    },
    findCatalogById(catalogList, id) {
      for (const catalog of catalogList || []) {
        if (catalog.id === id) {
          return catalog;
        }
        const childCatalog = this.findCatalogById(catalog.children, id);
        if (childCatalog) {
          return childCatalog;
        }
      }
      return null;
    },
    removeCatalogById(catalogList, id) {
      if (!catalogList || catalogList.length === 0) {
        return false;
      }
      const index = catalogList.findIndex(item => item.id === id);
      if (index > -1) {
        catalogList.splice(index, 1);
        return true;
      }
      for (const catalog of catalogList) {
        if (this.removeCatalogById(catalog.children, id)) {
          return true;
        }
      }
      return false;
    },
    isCatalogDescendant(sourceId, targetId) {
      const sourceCatalog = this.findCatalogById(this.catalogTreeList, sourceId);
      return this.containsCatalog(sourceCatalog, targetId);
    },
    containsCatalog(catalog, targetId) {
      if (!catalog || !catalog.children || catalog.children.length === 0) {
        return false;
      }
      for (const child of catalog.children) {
        if (child.id === targetId || this.containsCatalog(child, targetId)) {
          return true;
        }
      }
      return false;
    },
    listAlertCatalog() {
      const hideStateMap = this.getCatalogHideStateMap(this.catalogTreeList);
      this.$api.alert.catalog.listAlertCatalog().then(res => {
        this.catalogTreeList = this.buildCatalogTree(res.Return || [], null, new Set(), hideStateMap);
      });
    },
    getAuthValueList(authList) {
      return (authList || []).map(item => {
        if (item && typeof item === 'object') {
          return item.value || item.id || item.uuid || item.text || '';
        }
        return item;
      }).filter(Boolean);
    }
  },
  computed: {
    hasSearchCondition() {
      const { keyword, isActive, authList } = this.searchVal || {};
      return !!((keyword && keyword.trim()) || isActive === 0 || isActive === 1 || (authList && authList.length > 0));
    },
    searchDragOptions() {
      return {
        ...this.dragOptions,
        disabled: true
      };
    },
    filterCatalogTreeList() {
      const keyword = this.searchVal && this.searchVal.keyword ? this.searchVal.keyword.trim().toLowerCase() : '';
      const isActive = this.searchVal ? this.searchVal.isActive : null;
      const selectedAuthList = this.getAuthValueList(this.searchVal && this.searchVal.authList);
      if (!keyword && isActive !== 0 && isActive !== 1 && selectedAuthList.length === 0) {
        return this.catalogTreeList;
      }
      const filterCatalog = list => {
        const result = [];
        (list || []).forEach(catalog => {
          const catalogName = catalog.name ? catalog.name.toLowerCase() : '';
          const catalogAuthList = this.getAuthValueList(catalog.authList);
          const matchCatalogKeyword = !keyword || catalogName.includes(keyword);
          const matchCatalogActive = isActive === 0 || isActive === 1 ? catalog.isActive === isActive : true;
          const matchCatalogAuth = selectedAuthList.length > 0 ? selectedAuthList.some(item => catalogAuthList.includes(item)) : true;
          const children = filterCatalog(catalog.children || []);
          const viewList = (catalog.viewList || []).filter(view => {
            const name = view.name ? view.name.toLowerCase() : '';
            const label = view.label ? view.label.toLowerCase() : '';
            const viewAuthList = this.getAuthValueList(view.authList);
            const matchViewKeyword = !keyword || name.includes(keyword) || label.includes(keyword);
            const matchViewActive = isActive === 0 || isActive === 1 ? view.isActive === isActive : true;
            const matchViewAuth = selectedAuthList.length > 0 ? selectedAuthList.some(item => viewAuthList.includes(item)) : true;
            return matchViewKeyword && matchViewActive && matchViewAuth;
          });
          if (matchCatalogKeyword && matchCatalogActive && matchCatalogAuth) {
            result.push({
              ...catalog,
              _hideview: false,
              children: catalog.children || [],
              viewList: catalog.viewList || []
            });
          } else if (children.length > 0 || viewList.length > 0) {
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
      return filterCatalog(this.catalogTreeList);
    }
  }
};
</script>
<style lang="less" scoped>
.move {
  cursor: move;
}
.catalog-grid {
  display: grid;
  grid-template-columns: auto 100px 300px 320px;
  gap: 10px;
}
</style>
