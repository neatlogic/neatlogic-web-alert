<template>
  <div class="catalog-node-wrapper">
    <div
      class="bg-op radius-md padding mb-md catalog-grid catalog-row"
      :class="{ 'drop-active': isDropActive }"
      :style="rowStyle"
      @dragenter.prevent="handleDropEnter"
      @dragover.prevent="handleDropOver"
      @dragleave="handleDropLeave"
      @drop.prevent="handleDrop"
    >
      <div class="catalog-name">
        <span class="tsfont-bar move"></span>
        <span class="catalog-toggle cursor" :class="toggleClass" @click="toggleCatalog(catalog)"></span>
        <span class="catalog-type">目录</span>
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
        <div v-if="catalogIndex > 0" class="action-item tsfont-arrow-up" @click="$emit('move-catalog-up', parentId, catalog.id)">上移</div>
        <div v-if="catalogIndex < catalogCount - 1" class="action-item tsfont-arrow-down" @click="$emit('move-catalog-down', parentId, catalog.id)">下移</div>
        <div class="action-item tsfont-plus" @click="$emit('add-child', catalog)">子目录</div>
        <div class="action-item tsfont-edit" @click="$emit('edit-catalog', catalog)">{{ $t('page.edit') }}</div>
        <div :class="{ disable: hasChildOrView }" class="action-item tsfont-trash-o" @click="$emit('delete-catalog', catalog)">{{ $t('page.delete') }}</div>
      </div>
    </div>
    <div v-if="!catalog._hideview" class="catalog-children">
      <draggable
        v-if="catalog.children && catalog.children.length > 0"
        v-bind="dragOptions"
        tag="div"
        :list="catalog.children"
        :group="{ name: 'catalog', pull: true, put: false }"
        :sort="false"
        handle=".tsfont-bar"
        @start="$emit('catalog-drag-start', catalog.id, $event, catalog.children)"
        @end="$emit('catalog-drag-end')"
      >
        <AlertCatalogNode
          v-for="child in catalog.children"
          :key="child.id"
          :catalog="child"
          :pathIds="[...pathIds, catalog.id]"
          :parentId="catalog.id"
          :catalogIndex="getChildCatalogIndex(child.id)"
          :catalogCount="catalog.children.length"
          :level="level + 1"
          :draggingData="draggingData"
          :activeDropCatalogId="activeDropCatalogId"
          :dragOptions="dragOptions"
          @edit-catalog="$emit('edit-catalog', $event)"
          @delete-catalog="$emit('delete-catalog', $event)"
          @add-child="$emit('add-child', $event)"
          @edit-view="$emit('edit-view', $event)"
          @delete-view="$emit('delete-view', $event)"
          @catalog-drag-start="forwardCatalogDragStart"
          @catalog-drag-end="$emit('catalog-drag-end')"
          @view-drag-start="forwardViewDragStart"
          @view-drag-end="$emit('view-drag-end')"
          @move-catalog-up="forwardMoveCatalogUp"
          @move-catalog-down="forwardMoveCatalogDown"
          @move-view-up="forwardMoveViewUp"
          @move-view-down="forwardMoveViewDown"
          @set-drop-target="$emit('set-drop-target', $event)"
          @drop-to-catalog="$emit('drop-to-catalog', $event)"
        ></AlertCatalogNode>
      </draggable>
      <div v-if="catalog.viewList && catalog.viewList.length > 0">
        <draggable
          v-bind="dragOptions"
          tag="div"
          :list="catalog.viewList"
          :group="{ name: 'view', pull: true, put: false }"
          :sort="false"
          handle=".tsfont-bar"
          @start="$emit('view-drag-start', catalog.id, $event, catalog.viewList)"
          @end="$emit('view-drag-end')"
        >
          <div
            v-for="(view, viewIndex) in catalog.viewList"
            :key="view.id"
            class="bg-op radius-md padding mb-md catalog-grid"
            :style="viewRowStyle"
          >
            <div class="catalog-name">
              <span class="tsfont-bar move"></span>
              <span class="catalog-toggle toggle-placeholder"></span>
              <span class="view-type">视图</span>
              <span>{{ view.name }}</span>
              <span>·</span>
              <span>{{ view.label }}</span>
            </div>
            <div>
              <span v-if="view.isActive" class="text-success">是</span>
              <span v-else class="text-grey">否</span>
            </div>
            <div>
              <UserSelect
                v-model="view.authList"
                :multiple="true"
                :readonly="true"
                :groupList="['common', 'user', 'role', 'team']"
              ></UserSelect>
            </div>
            <div class="action-group">
              <div v-if="viewIndex > 0" class="action-item tsfont-arrow-up" @click="$emit('move-view-up', catalog.id, view.id)">上移</div>
              <div v-if="viewIndex < catalog.viewList.length - 1" class="action-item tsfont-arrow-down" @click="$emit('move-view-down', catalog.id, view.id)">下移</div>
              <div class="action-item tsfont-edit" @click="$emit('edit-view', view)">{{ $t('page.edit') }}</div>
              <div class="action-item tsfont-trash-o" @click="$emit('delete-view', view)">{{ $t('page.delete') }}</div>
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'AlertCatalogNode',
  components: {
    draggable,
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue'),
    AlertCatalogNode: () => import('./alert-catalog-node.vue')
  },
  props: {
    catalog: { type: Object, required: true },
    pathIds: { type: Array, default: () => [] },
    parentId: { type: Number, default: null },
    catalogIndex: { type: Number, default: 0 },
    catalogCount: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    draggingData: { type: Object, default: null },
    activeDropCatalogId: { type: Number, default: null },
    dragOptions: { type: Object, required: true }
  },
  methods: {
    forwardCatalogDragStart(parentId, evt, list) {
      this.$emit('catalog-drag-start', parentId, evt, list);
    },
    forwardViewDragStart(catalogId, evt, list) {
      this.$emit('view-drag-start', catalogId, evt, list);
    },
    forwardMoveCatalogUp(parentId, catalogId) {
      this.$emit('move-catalog-up', parentId, catalogId);
    },
    forwardMoveCatalogDown(parentId, catalogId) {
      this.$emit('move-catalog-down', parentId, catalogId);
    },
    forwardMoveViewUp(catalogId, viewId) {
      this.$emit('move-view-up', catalogId, viewId);
    },
    forwardMoveViewDown(catalogId, viewId) {
      this.$emit('move-view-down', catalogId, viewId);
    },
    getChildCatalogIndex(catalogId) {
      return (this.catalog.children || []).findIndex(item => item.id === catalogId);
    },
    toggleCatalog(catalog) {
      this.$set(catalog, '_hideview', !catalog._hideview);
    },
    handleDropEnter() {
      if (this.canDropToCurrentCatalog) {
        this.$emit('set-drop-target', this.catalog.id);
      }
    },
    handleDropOver() {
      if (this.canDropToCurrentCatalog && this.activeDropCatalogId !== this.catalog.id) {
        this.$emit('set-drop-target', this.catalog.id);
      }
    },
    handleDropLeave(event) {
      if (!this.$el.contains(event.relatedTarget) && this.activeDropCatalogId === this.catalog.id) {
        this.$emit('set-drop-target', null);
      }
    },
    handleDrop() {
      if (this.canDropToCurrentCatalog) {
        this.$emit('drop-to-catalog', this.catalog);
      }
    }
  },
  computed: {
    hasChildOrView() {
      return (this.catalog.children && this.catalog.children.length > 0) || (this.catalog.viewList && this.catalog.viewList.length > 0);
    },
    toggleClass() {
      if ((this.catalog.children && this.catalog.children.length > 0) || (this.catalog.viewList && this.catalog.viewList.length > 0)) {
        return this.catalog._hideview ? 'tsfont-drop-right' : 'tsfont-drop-down';
      }
      return 'tsfont-dot';
    },
    rowStyle() {
      return {
        marginLeft: `${this.level * 24}px`
      };
    },
    viewRowStyle() {
      return {
        marginLeft: `${(this.level + 1) * 24}px`
      };
    },
    isDropActive() {
      return this.activeDropCatalogId === this.catalog.id;
    },
    canDropToCurrentCatalog() {
      if (!this.draggingData) {
        return false;
      }
      if (this.draggingData.type === 'view' && this.draggingData.catalogId === this.catalog.id) {
        return false;
      }
      if (this.draggingData.type === 'catalog' && this.draggingData.itemId === this.catalog.id) {
        return false;
      }
      if (this.draggingData.type === 'catalog' && this.draggingData.parentId === this.catalog.id) {
        return false;
      }
      if (this.draggingData.type === 'catalog' && this.pathIds.includes(this.draggingData.itemId)) {
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="less" scoped>
.move {
  cursor: move;
}
.catalog-row {
  transition:
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
  margin-bottom: 14px;
}
.catalog-grid {
  display: grid;
  grid-template-columns: auto 100px 300px 320px;
  gap: 10px;
}
.catalog-children {
  padding-left: 0;
}
.catalog-drop-slot.drop-active {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(66, 153, 225, 0.14);
  box-shadow: inset 0 0 0 1px rgba(66, 153, 225, 0.25);
}
.catalog-name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.catalog-toggle {
  display: inline-block;
  width: 14px;
  min-width: 14px;
  text-align: center;
}
.toggle-placeholder {
  cursor: default;
}
.catalog-type,
.view-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 20px;
}
.catalog-type {
  color: #2b6cb0;
  background: rgba(66, 153, 225, 0.14);
}
.view-type {
  color: #2f855a;
  background: rgba(72, 187, 120, 0.14);
}
.catalog-row.drop-active {
  box-shadow: inset 0 0 0 2px var(--primary-color);
  background: rgba(66, 153, 225, 0.12);
}
.catalog-row.drop-active .catalog-type::after {
  content: ' <- 松开后移入';
  color: var(--primary-color);
  font-weight: 500;
}
</style>
