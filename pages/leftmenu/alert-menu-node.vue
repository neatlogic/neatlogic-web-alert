<template>
  <div>
    <div class="link alert-menu-link" style="height: auto">
      <Tooltip
        class="overflow-menu-tooltip"
        :content="catalog.name"
        :disabled="!isOverflowTooltip('catalog-' + catalog.id)"
        placement="right"
        transfer
      >
        <a
          class="alert-menu-a pt-sm pb-sm"
          :class="toggleClass"
          style="height: auto; line-height: 1"
          :style="rowStyle"
          @click="toggleCatalog(catalog)"
        >
          <span class="node-name overflow" :data-overflow-tooltip-key="'catalog-' + catalog.id">{{ catalog.name }}</span>
        </a>
      </Tooltip>
    </div>
    <div v-if="!catalog._hideview">
      <AlertMenuNode
        v-for="child in catalog.children"
        :key="child.id"
        :catalog="child"
        :level="level + 1"
        :overflowTooltipMap="overflowTooltipMap"
        @go-to="$emit('go-to', $event)"
      ></AlertMenuNode>
      <div
        v-for="view in catalog.viewList"
        :key="view.id"
        class="link alert-menu-link"
        style="height: auto"
        :class="{ active: $isMenuActive('/alert-manage/' + view.name) }"
      >
        <Tooltip
          class="overflow-menu-tooltip"
          :content="view.label"
          :disabled="!isOverflowTooltip('view-' + view.id)"
          placement="right"
          transfer
        >
          <a
            class="alert-menu-a pt-sm pb-sm tsfont-monitor"
            :style="viewRowStyle"
            style="height: auto; line-height: 1.1"
            @click="$emit('go-to', '/alert-manage/' + view.name)"
          >
            <span
              class="node-name overflow"
              :class="{'has-amount': view.alertCount > 0}"
              :data-overflow-tooltip-key="'view-' + view.id"
            >{{ view.label }}</span>
            <span v-if="view.alertCount > 0" class="text-error ml-xs superscript">
              <b>{{ view.alertCount }}</b>
            </span>
          </a>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertMenuNode',
  components: {
    AlertMenuNode: () => import('./alert-menu-node.vue')
  },
  props: {
    catalog: { type: Object, required: true },
    level: { type: Number, default: 0 },
    overflowTooltipMap: { type: Object, default: () => ({}) }
  },
  methods: {
    isOverflowTooltip(key) {
      return !!this.overflowTooltipMap[key];
    },
    toggleCatalog(catalog) {
      this.$set(catalog, '_hideview', !catalog._hideview);
    }
  },
  computed: {
    rowStyle() {
      return {
        'margin-left': this.level * 12 + 'px'
      };
    },
    viewRowStyle() {
      return {
        'margin-left': (this.level + 1) * 12 + 'px'
      };
    },
    toggleClass() {
      if ((this.catalog.children && this.catalog.children.length > 0) || (this.catalog.viewList && this.catalog.viewList.length > 0)) {
        return this.catalog._hideview ? 'tsfont-drop-right' : 'tsfont-drop-down';
      }
      return 'tsfont-dot';
    }
  }
};
</script>
<style lang="less" scoped>
.superscript {
  font-size: 0.7em;
  vertical-align: super;
}
.node-name {
  display: inline-block;
  max-width: calc(100% - 28px);
  vertical-align: middle;
  &.has-amount {
    max-width: calc(100% - 58px);
  }
}
</style>
